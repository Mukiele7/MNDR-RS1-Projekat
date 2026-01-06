namespace MNDR.Application.Modules.Auth.Commands.Logout;

/// <summary>
/// Command za logout korisnika.
/// </summary>
public sealed class LogoutCommand : IRequest<LogoutCommandDto>
{
    public required int UserId { get; init; }
}
