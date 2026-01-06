using MNDR.Domain.Common;

namespace MNDR.Domain.Entities
{
    public class Ugovor : BaseEntity
    {
        public int UgovorId { get; set; }
        public int OglasId { get; set; }
        public int KupacId { get; set; }
        public int MajstorId { get; set; }
        public DateTime DatumOd { get; set; }
        public DateTime DatumDo { get; set; }
        public decimal Cena { get; set; }
        public DateTime DatumKreiranja { get; set; }
        public string Status { get; set; } = "Aktivan";
        public string? Opis { get; set; }

        // Navigation
        public virtual Oglas? Oglas { get; set; }
        public virtual Kupac? Kupac { get; set; }
        public virtual Majstor? Majstor { get; set; }
        public virtual ICollection<Recenzija> Recenzije { get; set; } = new List<Recenzija>();
    }
}
