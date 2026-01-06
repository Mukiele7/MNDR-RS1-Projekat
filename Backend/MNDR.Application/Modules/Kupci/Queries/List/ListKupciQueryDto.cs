namespace MNDR.Application.Modules.Kupci.Queries.List;

public class ListKupciQueryDto
{
    public int KorisnikId { get; set; }
    public string Ime { get; set; } = string.Empty;
    public string Prezime { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefon { get; set; } = string.Empty;
    public string? Grad { get; set; }
    public string? Opcina { get; set; }
    public string? OpisProfila { get; set; }
    public string? SlikaProfila { get; set; }
    public decimal OcjenaPouzdanosti { get; set; }
    public int BrojNarudzbi { get; set; }
    public DateTime DatumRegistracije { get; set; }
}
