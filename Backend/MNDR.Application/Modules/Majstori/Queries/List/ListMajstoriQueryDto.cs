namespace MNDR.Application.Modules.Majstori.Queries.List;

public class ListMajstoriQueryDto
{
    public int KorisnikId { get; set; }
    public string Ime { get; set; } = string.Empty;
    public string Prezime { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefon { get; set; } = string.Empty;
    public string? Grad { get; set; }
    public string? Opcina { get; set; }
    public string Specijalizacija { get; set; } = string.Empty;
    public int GodineIskustva { get; set; }
    public decimal CijenaMjesecne { get; set; }
    public decimal CijenaSat { get; set; }
    public decimal ProsjecnaOcjena { get; set; }
    public int BrojZavrsenihPoslova { get; set; }
    public string? DetaljanOpisProfila { get; set; }
    public DateTime DatumRegistracije { get; set; }
}
