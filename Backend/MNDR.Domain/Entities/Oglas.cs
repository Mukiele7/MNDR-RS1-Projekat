using MNDR.Domain.Common;

namespace MNDR.Domain.Entities
{
    public class Oglas : BaseEntity
    {
        public int OglasId { get; set; }
        public int MajstorId { get; set; }
        public string Naslov { get; set; } = string.Empty;
        public string Opis { get; set; } = string.Empty;
        public DateTime DatumObjave { get; set; }
        public string Status { get; set; } = string.Empty;

        // Navigation
        public virtual Majstor? Majstor { get; set; }
        public virtual ICollection<OglasKategorija> OglasKategorije { get; set; } = new List<OglasKategorija>();
        public virtual ICollection<Razgovor> Razgovori { get; set; } = new List<Razgovor>();
        public virtual ICollection<Ugovor> Ugovori { get; set; } = new List<Ugovor>();
    }
}
