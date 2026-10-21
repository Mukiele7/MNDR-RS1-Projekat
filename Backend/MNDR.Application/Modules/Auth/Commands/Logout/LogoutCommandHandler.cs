namespace MNDR.Application.Modules.Auth.Commands.Logout;

/// <summary>
/// Handler za LogoutCommand.
/// </summary>
public sealed class LogoutCommandHandler : IRequestHandler<LogoutCommand, LogoutCommandDto>
{
    private readonly IAppDbContext _context;
    private readonly IJwtTokenService _jwtService;

    public LogoutCommandHandler(IAppDbContext context, IJwtTokenService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<LogoutCommandDto> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            var hash = _jwtService.HashRefreshToken(request.RefreshToken);
            var token = await _context.RefreshTokens
                .FirstOrDefaultAsync(x => x.TokenHash == hash, cancellationToken);
            if (token is not null)
            {
                token.IsRevoked = true;
                token.RevokedAtUtc = DateTime.UtcNow;
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        return new LogoutCommandDto { Message = "Uspešno ste se odjavili." };
    }
}
