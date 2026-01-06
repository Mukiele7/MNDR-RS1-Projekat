using MNDR.Domain.Common;

namespace MNDR.Domain.Entities
{
    public class Notifikacija : BaseEntity
    {
        public int NotifikacijaId { get; set; }
        public int KorisnikId { get; set; }
        public string Sadrzaj { get; set; } = string.Empty;
        public string TipNotifikacije { get; set; } = string.Empty;
        public bool Procitano { get; set; }
        public DateTime DatumSlanja { get; set; }

        // Navigation
        public virtual Korisnik? Korisnik { get; set; }
    }
}
