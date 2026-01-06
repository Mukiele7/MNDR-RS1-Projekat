namespace MNDR.Domain.Entities
{
    public class Badge
    {
        public int BadgeId { get; set; }
        public string Naziv { get; set; } = string.Empty;
        public string? Opis { get; set; }
        public DateTime DatumDodjele { get; set; }

        // Navigation
        public virtual ICollection<BadgeNagrada> BadgeNagrade { get; set; } = new List<BadgeNagrada>();
    }
}
