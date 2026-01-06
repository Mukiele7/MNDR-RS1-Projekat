using MNDR.Domain.Common;

namespace MNDR.Domain.Entities
{
    public class Razgovor : BaseEntity
    {
        public int RazgovorId { get; set; }
        public int KupacId { get; set; }
        public int MajstorId { get; set; }
        public int OglasId { get; set; }
        public DateTime DatumKreiranja { get; set; }
        public DateTime DatumUpdate { get; set; }
        public DateTime? DatumZavrsetka { get; set; }

        // Navigation
        public virtual Kupac? Kupac { get; set; }
        public virtual Majstor? Majstor { get; set; }
        public virtual Oglas? Oglas { get; set; }
        public virtual ICollection<RazgovorPoruka> Poruke { get; set; } = new List<RazgovorPoruka>();
    }
}
