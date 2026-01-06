namespace MNDR.Domain.Entities
{
    public class Kategorija
    {
        public int KategorijaId { get; set; }
        public string Naziv { get; set; } = string.Empty;
        public string? Opis { get; set; }

        // Navigation
        public virtual ICollection<OglasKategorija> OglasKategorije { get; set; } = new List<OglasKategorija>();
    }
}
