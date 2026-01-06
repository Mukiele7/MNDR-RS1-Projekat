namespace MNDR.Application.Modules.Auth.Commands.RefreshToken;

/// <summary>
/// Command za obnavljanje access tokena koristeći refresh token.
/// </summary>
public sealed class RefreshTokenCommand : IRequest<RefreshTokenCommandDto>
{
    /// <summary>
    /// Refresh token koji korisnik šalje.
    /// </summary>
    public required string RefreshToken { get; init; }

    /// <summary>
    /// Device fingerprint (browser + IP hash) za validaciju da je token korišćen sa istog uređaja.
    /// </summary>
    public string? DeviceFingerprint { get; init; }
}
