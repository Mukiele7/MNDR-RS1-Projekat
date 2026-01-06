using MNDR.Domain.Common;

namespace MNDR.Domain.Entities
{
    public class Korisnik
    {
        public int KorisnikId { get; set; }
        public string Ime { get; set; } = string.Empty;
        public string Prezime { get; set; } = string.Empty;
        public string? KorisnickoIme { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Lozinka { get; set; } = string.Empty;
        public string Telefon { get; set; } = string.Empty;
        public string Uloga { get; set; } = string.Empty;
        public DateTime DatumRegistracije { get; set; }
        public string? Grad { get; set; }
        public string? Opcina { get; set; }
        public string? OpisProfila { get; set; }
        public string? SlikaProfila { get; set; }

        // Aliases for compatibility (Id comes from BaseEntity)
        public int KorisnikIdAlias => KorisnikId;
        public string FirstName => Ime;
        public string LastName => Prezime;
        public string PasswordHash => Lozinka;
        public string Role => Uloga;

        // Navigation properties
        public virtual Administrator? Administrator { get; set; }
        public virtual Kupac? Kupac { get; set; }
        public virtual Majstor? Majstor { get; set; }
        public virtual ICollection<Notifikacija> Notifikacije { get; set; } = new List<Notifikacija>();
        public virtual ICollection<RazgovorPoruka> RazgovorPoruke { get; set; } = new List<RazgovorPoruka>();
    }
}
