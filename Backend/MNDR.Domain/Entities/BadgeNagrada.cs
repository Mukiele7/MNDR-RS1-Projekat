namespace MNDR.Domain.Entities
{
    public class BadgeNagrada
    {
        public int BadgeNagradaId { get; set; }
        public int BadgeId { get; set; }
        public int MajstorId { get; set; }
        public DateTime DatumDodjele { get; set; }

        // Navigation
        public virtual Badge? Badge { get; set; }
        public virtual Majstor? Majstor { get; set; }
    }
}
