using Microsoft.AspNetCore.Identity;

namespace MNDR.Application.Modules.Auth.Commands.Login;

/// <summary>
/// Handler za LoginCommand.
/// Validira kredencijale i generiše JWT token.
/// </summary>
public sealed class LoginCommandHandler : IRequestHandler<LoginCommand, LoginCommandDto>
{
    private readonly IAppDbContext _context;
    private readonly IJwtTokenService _jwtService;
    private readonly IPasswordHasher<Korisnik> _passwordHasher;

    public LoginCommandHandler(
        IAppDbContext context, 
        IJwtTokenService jwtService,
        IPasswordHasher<Korisnik> passwordHasher)
    {
        _context = context;
        _jwtService = jwtService;
        _passwordHasher = passwordHasher;
    }

    public async Task<LoginCommandDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        // Traži korisnika po email-u
        var user = await _context.Korisnici
            .FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken)
            ?? throw new MndrNotFoundException("Korisnik sa ovim email-om nije pronađen ili je deaktiviran.");

        // Verifikuj lozinku koristeći ASP.NET Core Identity PasswordHasher
        var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (verificationResult == PasswordVerificationResult.Failed)
        {
            throw new MndrConflictException("Pogrešna lozinka.");
        }

        // Generiši par tokena (access + refresh)
        var tokenPair = _jwtService.IssueTokens(user);

        // TODO: Sačuvaj refresh token u bazi kada RefreshTokens tabela bude kreirana
        /*
        var refreshToken = new Domain.Entities.RefreshToken
        {
            TokenHash = tokenPair.RefreshTokenHash,
            ExpiresAtUtc = tokenPair.RefreshTokenExpiresAtUtc,
            UserId = user.KorisnikId,
            Fingerprint = request.DeviceFingerprint,
            IsRevoked = false
        };

        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync(cancellationToken);
        */

        return new LoginCommandDto
        {
            AccessToken = tokenPair.AccessToken,
            RefreshToken = tokenPair.RefreshTokenRaw,
            Email = user.Email,
            FullName = $"{user.Ime} {user.Prezime}",
            Role = user.Uloga,
            UserId = user.KorisnikId,
            SlikaProfila = user.SlikaProfila
        };
    }
}
