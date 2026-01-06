using System.ComponentModel.DataAnnotations;

namespace MNDR.Infrastructure.Options;

/// <summary>
/// Strongly-typed konfiguracija za connection strings.
/// Učitava se iz appsettings.json sekcije "ConnectionStrings".
/// </summary>
public class ConnectionStringsOptions
{
    public const string SectionName = "ConnectionStrings";

    /// <summary>
    /// Glavni connection string za bazu podataka.
    /// </summary>
    [Required(ErrorMessage = "DefaultConnection connection string je obavezan")]
    public string DefaultConnection { get; init; } = string.Empty;
}
