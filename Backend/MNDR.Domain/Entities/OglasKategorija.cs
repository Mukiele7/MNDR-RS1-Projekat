namespace MNDR.Domain.Entities
{
    public class OglasKategorija
    {
        public int OglasKategorijaId { get; set; }
        public int OglasId { get; set; }
        public int KategorijaId { get; set; }

        // Navigation
        public virtual Oglas? Oglas { get; set; }
        public virtual Kategorija? Kategorija { get; set; }
    }
}
