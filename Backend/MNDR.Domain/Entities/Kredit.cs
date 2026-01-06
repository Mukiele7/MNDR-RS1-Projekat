using MNDR.Domain.Common;

namespace MNDR.Domain.Entities
{
    public class Kredit : BaseEntity
    {
        public int TransakcijaKreditaId { get; set; }
        public int MajstorId { get; set; }
        public decimal Iznos { get; set; }
        public int BrojKupljenihKredita { get; set; }
        public DateTime DatumTransakcija { get; set; }
        public string NacinPlacanja { get; set; } = string.Empty;
        public string StatusTransakcije { get; set; } = string.Empty;

        // Navigation
        public virtual Majstor? Majstor { get; set; }
    }
}
