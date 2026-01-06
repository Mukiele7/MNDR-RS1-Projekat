using MNDR.Domain.Entities;

namespace MNDR.Application.Abstractions;

/// <summary>
/// DTO koji sadrži access i refresh token zajedno.
/// </summary>
public sealed class JwtTokenPair
{
    public string AccessToken { get; init; } = string.Empty;
    public DateTime AccessTokenExpiresAtUtc { get; init; }
    public string RefreshTokenRaw { get; init; } = string.Empty;
    public string RefreshTokenHash { get; init; } = string.Empty;
    public DateTime RefreshTokenExpiresAtUtc { get; init; }
}

/// <summary>
/// Servis za generisanje i validaciju JWT tokena.
/// </summary>
public interface IJwtTokenService
{
    /// <summary>
    /// Generiše par tokena: access token (kratkog veka) i refresh token (dugog veka).
    /// Access token se koristi za autorizaciju API zahteva.
    /// Refresh token se koristi za dobijanje novog access tokena kad stari istekne.
    /// </summary>
    /// <param name="user">Korisnik za kog se generišu tokeni</param>
    /// <returns>Par tokena sa njihovim hash-ovima i expiration vremenima</returns>
    JwtTokenPair IssueTokens(Korisnik user);

    /// <summary>
    /// Heširuje refresh token za čuvanje u bazi.
    /// Čuva se hash, a ne sam token, iz bezbednosnih razloga.
    /// </summary>
    /// <param name="rawToken">Sirovi refresh token</param>
    /// <returns>SHA256 hash tokena</returns>
    string HashRefreshToken(string rawToken);

    /// <summary>
    /// Validira JWT access token i vraća userId iz njega.
    /// </summary>
    /// <param name="token">JWT token za validaciju</param>
    /// <returns>UserId ako je token validan, null ako nije</returns>
    int? ValidateToken(string token);
}
