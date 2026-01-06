namespace MNDR.Application.Modules.Ugovori.Queries.GetUgovori;

public sealed class UgovorDto
{
    public int UgovorId { get; set; }
    public int KupacId { get; set; }
    public string KupacIme { get; set; } = string.Empty;
    public int OglasId { get; set; }
    public string OglasNaslov { get; set; } = string.Empty;
    public DateTime DatumOd { get; set; }
    public DateTime DatumDo { get; set; }
    public decimal Cena { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime DatumKreiranja { get; set; }
}
