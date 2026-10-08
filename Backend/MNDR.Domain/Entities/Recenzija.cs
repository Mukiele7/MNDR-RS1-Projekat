using MNDR.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

namespace MNDR.Domain.Entities
{
    public class Recenzija : BaseEntity
    {
        public int RecenzijaId { get; set; }
        public int UgovorId { get; set; }
        [NotMapped]
        public int MajstorId { get; set; }
        [NotMapped]
        public int KupacId { get; set; }
        public int Ocjena { get; set; }
        public int Ocena => Ocjena;  // Alias for compatibility
        public string? Komentar { get; set; }
        public DateTime DatumRecenzije { get; set; }

        // Navigation
        public virtual Ugovor? Ugovor { get; set; }
        public virtual Majstor? Majstor { get; set; }
        public virtual Kupac? Kupac { get; set; }
    }
}
