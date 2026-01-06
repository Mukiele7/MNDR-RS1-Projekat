namespace MNDR.Application.Modules.Auth.Commands.RefreshToken;

/// <summary>
/// Response za uspešno obnavljanje tokena.
/// </summary>
public sealed class RefreshTokenCommandDto
{
    public required string AccessToken { get; init; }
    public required string RefreshToken { get; init; }
    public required string Email { get; init; }
    public required string FullName { get; init; }
    public required string Role { get; init; }
    public required int UserId { get; init; }
}
