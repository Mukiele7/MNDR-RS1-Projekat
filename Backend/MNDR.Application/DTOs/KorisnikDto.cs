namespace MNDR.Application.DTOs
{
    public class KorisnikDto
    {
        public int KorisnikId { get; set; }
        public string Ime { get; set; } = string.Empty;
        public string Prezime { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefon { get; set; } = string.Empty;
        public string Uloga { get; set; } = string.Empty;
        public string? Grad { get; set; }
        public string? Opcina { get; set; }
        public string? OpisProfila { get; set; }
        public string? SlikaProfila { get; set; }
        public DateTime DatumRegistracije { get; set; }
    }

    public class CreateKorisnikDto
    {
        public string Ime { get; set; } = string.Empty;
        public string Prezime { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Lozinka { get; set; } = string.Empty;
        public string Telefon { get; set; } = string.Empty;
        public string Uloga { get; set; } = string.Empty;
        public string? Grad { get; set; }
        public string? Opcina { get; set; }
    }

    public class UpdateKorisnikDto
    {
        public int KorisnikId { get; set; }
        public string Ime { get; set; } = string.Empty;
        public string Prezime { get; set; } = string.Empty;
        public string Telefon { get; set; } = string.Empty;
        public string? Grad { get; set; }
        public string? Opcina { get; set; }
        public string? OpisProfila { get; set; }
    }
}
