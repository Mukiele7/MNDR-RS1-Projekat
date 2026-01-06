namespace MNDR.Application.Modules.Auth.Commands.Login;

/// <summary>
/// Response za uspešan login.
/// Sadrži access token za autorizaciju i refresh token za obnavljanje sesije.
/// </summary>
public sealed class LoginCommandDto
{
    public required string AccessToken { get; init; }
    public required string RefreshToken { get; init; }
    public required string Email { get; init; }
    public required string FullName { get; init; }
    public required string Role { get; init; }
    public required int UserId { get; init; }
    public string? SlikaProfila { get; init; }
}
