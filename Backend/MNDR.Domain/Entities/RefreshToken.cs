using MNDR.Domain.Common;

namespace MNDR.Domain.Entities;

/// <summary>
/// Refresh token entitet za JWT autentifikaciju.
/// Omogućava obnavljanje access tokena bez ponovnog unošenja kredencijala.
/// </summary>
public class RefreshToken : BaseEntity
{
    /// <summary>
    /// Hash verzija refresh tokena za sigurno čuvanje u bazi.
    /// Originalni token se nikada ne čuva u plain text formatu.
    /// </summary>
    public string TokenHash { get; set; } = string.Empty;

    /// <summary>
    /// Datum i vreme isteka refresh tokena u UTC.
    /// </summary>
    public DateTime ExpiresAtUtc { get; set; }

    /// <summary>
    /// ID korisnika kome pripada ovaj refresh token.
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// Device fingerprint (npr. browser signature, IP, User-Agent hash).
    /// Dodatni security layer za detekciju token theft-a.
    /// </summary>
    public string? Fingerprint { get; set; }

    /// <summary>
    /// Indikator da li je token opozvan (revoked).
    /// Omogućava force logout korisnika sa svih uređaja.
    /// </summary>
    public bool IsRevoked { get; set; }

    /// <summary>
    /// Datum i vreme kada je token opozvan (ako jeste).
    /// </summary>
    public DateTime? RevokedAtUtc { get; set; }

    // Navigation property
    public virtual Korisnik? User { get; set; }
}
