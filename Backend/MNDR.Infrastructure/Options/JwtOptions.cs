using System.ComponentModel.DataAnnotations;

namespace MNDR.Infrastructure.Options;

/// <summary>
/// Strongly-typed konfiguracija za JWT token.
/// Učitava se iz appsettings.json sekcije "Jwt".
/// </summary>
public class JwtOptions
{
    public const string SectionName = "Jwt";

    /// <summary>
    /// Tajni ključ za potpisivanje tokena (mora biti minimum 32 karaktera).
    /// </summary>
    [Required]
    [MinLength(32, ErrorMessage = "JWT Secret mora biti najmanje 32 karaktera")]
    public string Secret { get; init; } = string.Empty;

    /// <summary>
    /// Issuer tokena (ko je izdao token).
    /// </summary>
    [Required]
    public string Issuer { get; init; } = string.Empty;

    /// <summary>
    /// Audience tokena (za koga je token namenjen).
    /// </summary>
    [Required]
    public string Audience { get; init; } = string.Empty;

    /// <summary>
    /// Vreme trajanja access tokena u minutima.
    /// </summary>
    [Range(1, 1440, ErrorMessage = "ExpiryMinutes mora biti između 1 i 1440 (24h)")]
    public int ExpiryMinutes { get; init; } = 60;

    /// <summary>
    /// Vreme trajanja refresh tokena u danima.
    /// </summary>
    [Range(1, 365, ErrorMessage = "RefreshTokenExpiryDays mora biti između 1 i 365")]
    public int RefreshTokenExpiryDays { get; init; } = 7;
}
