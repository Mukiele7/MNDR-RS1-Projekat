using Microsoft.EntityFrameworkCore;

namespace MNDR.Application.Modules.Auth.Commands.RefreshToken;

/// <summary>
/// Handler za RefreshTokenCommand.
/// Validira stari refresh token i izdaje novi par tokena.
/// </summary>
public sealed class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, RefreshTokenCommandDto>
{
    private readonly IAppDbContext _context;
    private readonly IJwtTokenService _jwtService;

    public RefreshTokenCommandHandler(IAppDbContext context, IJwtTokenService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<RefreshTokenCommandDto> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        // Hash-uj prosleđeni refresh token da bi ga uporedio sa hash-om u bazi
        var tokenHash = _jwtService.HashRefreshToken(request.RefreshToken);

        // Pronađi refresh token u bazi
        var storedToken = await _context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.TokenHash == tokenHash, cancellationToken)
            ?? throw new MndrNotFoundException("Refresh token nije pronađen.");

        // Proveri da li je token istekao
        if (storedToken.ExpiresAtUtc < DateTime.UtcNow)
        {
            throw new MndrConflictException("Refresh token je istekao. Molimo da se ponovo prijavite.");
        }

        // Proveri da li je token opozvan (logout)
        if (storedToken.IsRevoked)
        {
            throw new MndrConflictException("Refresh token je opozvan. Molimo da se ponovo prijavite.");
        }

        // Validacija fingerprint-a (opciono - samo upozori, ne blokiraj)
        if (!string.IsNullOrEmpty(request.DeviceFingerprint) && 
            !string.IsNullOrEmpty(storedToken.Fingerprint) &&
            request.DeviceFingerprint != storedToken.Fingerprint)
        {
            // Token se koristi sa drugog uređaja - potencijalna krađa tokena
            // U production okruženju, ovo bi trebalo da opozove token i notifikuje korisnika
            // Za sada samo bacamo exception
            throw new MndrConflictException("Refresh token se koristi sa drugog uređaja. Molimo da se ponovo prijavite.");
        }

        // Proveri da li je korisnik aktivan
        if (storedToken.User == null)
        {
            throw new MndrNotFoundException("Korisnik nije pronađen ili je deaktiviran.");
        }

        // Opozovi stari refresh token (rotation strategy)
        storedToken.IsRevoked = true;
        storedToken.RevokedAtUtc = DateTime.UtcNow;

        // Generiši novi par tokena
        var tokenPair = _jwtService.IssueTokens(storedToken.User);

        // Sačuvaj novi refresh token u bazi
        var newRefreshToken = new Domain.Entities.RefreshToken
        {
            TokenHash = tokenPair.RefreshTokenHash,
            ExpiresAtUtc = tokenPair.RefreshTokenExpiresAtUtc,
            UserId = storedToken.User.KorisnikId,
            Fingerprint = request.DeviceFingerprint,
            IsRevoked = false
        };

        _context.RefreshTokens.Add(newRefreshToken);
        await _context.SaveChangesAsync(cancellationToken);

        return new RefreshTokenCommandDto
        {
            AccessToken = tokenPair.AccessToken,
            RefreshToken = tokenPair.RefreshTokenRaw,
            Email = storedToken.User.Email,
            FullName = $"{storedToken.User.Ime} {storedToken.User.Prezime}",
            Role = storedToken.User.Uloga,
            UserId = storedToken.User.KorisnikId
        };
    }
}
