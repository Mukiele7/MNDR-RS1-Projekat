namespace MNDR.Domain.Entities;

public class PortfolioSlika
{
    public int PortfolioSlikaId { get; set; }
    public int MajstorId { get; set; }
    public string SlikaUrl { get; set; } = string.Empty;
    public string? Opis { get; set; }
    public bool JeIstaknuta { get; set; } = false; // Za Portfolio (max 3)
    public DateTime DatumKreiranja { get; set; } = DateTime.Now;

    // Navigation property
    public virtual Majstor? Majstor { get; set; }
}
