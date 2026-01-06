namespace MNDR.Domain.Entities
{
    public class RazgovorPoruka
    {
        public int RazgovorPorukaId { get; set; }
        public int RazgovorId { get; set; }
        public int PosiljaocId { get; set; }
        public string Sadrzaj { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime VrijemeSlanja { get; set; }

        // Navigation
        public virtual Razgovor? Razgovor { get; set; }
        public virtual Korisnik? Posiljaoc { get; set; }
    }
}
