namespace MNDR.Application.Modules.Auth.Commands.Register;

/// <summary>
/// Response za uspešnu registraciju.
/// </summary>
public sealed class RegisterCommandDto
{
    public required int UserId { get; init; }
    public required string Email { get; init; }
    public required string Message { get; init; }
}
