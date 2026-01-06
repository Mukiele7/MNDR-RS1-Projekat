namespace MNDR.Application.Modules.Auth.Commands.Logout;

/// <summary>
/// Handler za LogoutCommand.
/// </summary>
public sealed class LogoutCommandHandler : IRequestHandler<LogoutCommand, LogoutCommandDto>
{
    public Task<LogoutCommandDto> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        // Za sada samo vraćamo success message
        // U produkciji ovde bi invalidirali refresh token ako ga koristimo
        return Task.FromResult(new LogoutCommandDto
        {
            Message = "Uspešno ste se odjavili."
        });
    }
}
