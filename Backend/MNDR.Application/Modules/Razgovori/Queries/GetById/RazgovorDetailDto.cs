namespace MNDR.Application.Modules.Razgovori.Queries.GetById;

public sealed class RazgovorDetailDto
{
    public int RazgovorId { get; set; }
    public int KupacId { get; set; }
    public int MajstorId { get; set; }
    public int OglasId { get; set; }
    public string KupacIme { get; set; } = string.Empty;
    public string MajstorIme { get; set; } = string.Empty;
    public DateTime DatumKreiranja { get; set; }
    public DateTime DatumUpdate { get; set; }
    public List<RazgovorPorukaDetailDto> Poruke { get; set; } = new();
}

public sealed class RazgovorPorukaDetailDto
{
    public int RazgovorPorukaId { get; set; }
    public int PosiljaocId { get; set; }
    public string Sadrzaj { get; set; } = string.Empty;
    public DateTime VrijemeSlanja { get; set; }
    public string PosiljaocIme { get; set; } = string.Empty;
}
