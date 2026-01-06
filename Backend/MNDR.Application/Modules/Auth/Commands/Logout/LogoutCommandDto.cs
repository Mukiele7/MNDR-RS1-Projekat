namespace MNDR.Application.Modules.Auth.Commands.Logout;

/// <summary>
/// Response za logout.
/// </summary>
public sealed class LogoutCommandDto
{
    public required string Message { get; init; }
}
