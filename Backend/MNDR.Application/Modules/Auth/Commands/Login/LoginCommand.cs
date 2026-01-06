namespace MNDR.Application.Modules.Auth.Commands.Login;

/// <summary>
/// Command za login korisnika.
/// </summary>
public sealed class LoginCommand : IRequest<LoginCommandDto>
{
    public required string Email { get; init; }
    public required string Password { get; init; }
    
    /// <summary>
    /// Device fingerprint (browser + IP hash) za praćenje tokena po uređaju.
    /// </summary>
    public string? DeviceFingerprint { get; init; }
}
