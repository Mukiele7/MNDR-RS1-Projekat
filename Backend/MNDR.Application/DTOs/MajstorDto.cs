namespace MNDR.Application.DTOs
{
    public class MajstorDto
    {
        public int KorisnikId { get; set; }
        public string Ime { get; set; } = string.Empty;
        public string Prezime { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefon { get; set; } = string.Empty;
        public string Grad { get; set; } = string.Empty;
        public string? Opcina { get; set; }
        public string Specijalizacija { get; set; } = string.Empty;
        public int GodineIskustva { get; set; }
        public decimal ProsjecnaOcjena { get; set; }
        public int BrojZavrsenihPoslova { get; set; }
        public decimal CijenaMjesecne { get; set; }
        public decimal CijenaSat { get; set; }
        public string? OpisProfila { get; set; }
        public DateTime DatumRegistracije { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
    }

    public class PagedMajstoriResult
    {
        public List<MajstorDto> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}
