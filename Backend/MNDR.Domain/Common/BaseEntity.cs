namespace MNDR.Domain.Common;

/// <summary>
/// Bazna klasa za sve entitete.
/// Sadrži common polja koja svaki entitet treba da ima.
/// </summary>
public abstract class BaseEntity
{
    /// <summary>
    /// Primarni ključ entiteta.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Soft delete flag - označava da li je entitet obrisan.
    /// Umesto fizičkog brisanja, setujemo ovu vrednost na true.
    /// </summary>
    public bool IsDeleted { get; set; }

    /// <summary>
    /// Datum i vreme kada je entitet kreiran (UTC).
    /// Automatski se setuje u DbContext.SaveChangesAsync().
    /// </summary>
    public DateTime CreatedAtUtc { get; set; }

    /// <summary>
    /// Datum i vreme poslednje izmene (UTC).
    /// Automatski se ažurira u DbContext.SaveChangesAsync().
    /// </summary>
    public DateTime? ModifiedAtUtc { get; set; }
}
