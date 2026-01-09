namespace MNDR.Domain.Entities
{
    public class Majstor
    {
        public int KorisnikId { get; set; }
        public string? DetaljanOpisProfila { get; set; }
        public string? OpisProfila { get; set; }
        public int GodineIskustva { get; set; }
        public decimal ProsjecnaOcjena { get; set; }
        public int BrojZavrsenihPoslova { get; set; }
        public string Specijalizacija { get; set; } = string.Empty;
        public decimal CijenaMjesecne { get; set; }
        public decimal CijenaSat { get; set; }
        public DateTime DatumRegistracije { get; set; } = DateTime.Now;

        // Properties for compatibility
        public string Ime => Korisnik?.Ime ?? "";
        public string Prezime => Korisnik?.Prezime ?? "";
        public string FirstName => Ime;  // Alias for compatibility
        public string LastName => Prezime;  // Alias for compatibility

        // Navigation
        public virtual Korisnik? Korisnik { get; set; }
        public virtual ICollection<BadgeNagrada> BadgeNagrade { get; set; } = new List<BadgeNagrada>();
        public virtual ICollection<Kredit> Krediti { get; set; } = new List<Kredit>();
        public virtual ICollection<Oglas> Oglasi { get; set; } = new List<Oglas>();
        public virtual ICollection<PortfolioSlika> PortfolioSlike { get; set; } = new List<PortfolioSlika>();
        public virtual ICollection<Razgovor> Razgovori { get; set; } = new List<Razgovor>();
        public virtual ICollection<Ugovor> Ugovori { get; set; } = new List<Ugovor>();
    }
}
