namespace MNDR.Application.Modules.Auth.Commands.Register;

/// <summary>
/// Command za registraciju novog korisnika.
/// </summary>
public sealed class RegisterCommand : IRequest<RegisterCommandDto>
{
    public required string FirstName { get; init; }
    public required string LastName { get; init; }
    public required string Email { get; init; }
    public required string PhoneNumber { get; init; }
    public required string Password { get; init; }
    public required string ConfirmPassword { get; init; }
    public required int Role { get; init; } // 0 = Kupac, 1 = Majstor, 2 = Administrator
}
