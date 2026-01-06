namespace MNDR.Application.Modules.Oglasi.Queries.GetAll;

public sealed class OglasQueryDto
{
    public int OglasId { get; set; }
    public int MajstorId { get; set; }
    public string Naslov { get; set; } = string.Empty;
    public string Opis { get; set; } = string.Empty;
    public DateTime DatumObjave { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? MajstorIme { get; set; }
    public string? Grad { get; set; }
    public List<string> Kategorije { get; set; } = new();
}
