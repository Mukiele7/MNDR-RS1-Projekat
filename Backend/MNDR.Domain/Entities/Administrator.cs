namespace MNDR.Domain.Entities
{
    public class Administrator
    {
        public int AdministratorId { get; set; }
        public string NivoPristupa { get; set; } = string.Empty;
        public int KorisnikId { get; set; }
        public DateTime DatumDodavanja { get; set; }
        public bool Aktivan { get; set; }

        // Navigation
        public virtual Korisnik? Korisnik { get; set; }
    }
}
