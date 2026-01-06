namespace MNDR.Domain.Entities
{
    public class Kupac
    {
        public int KorisnikId { get; set; }
        public int BrojNarudzbi { get; set; }
        public decimal OcjenaPouzdanosti { get; set; }

        // Navigation
        public virtual Korisnik? Korisnik { get; set; }
        public virtual ICollection<Razgovor> Razgovori { get; set; } = new List<Razgovor>();
        public virtual ICollection<Ugovor> Ugovori { get; set; } = new List<Ugovor>();
    }
}
