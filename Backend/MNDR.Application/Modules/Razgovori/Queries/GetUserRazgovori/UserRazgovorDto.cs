namespace MNDR.Application.Modules.Razgovori.Queries.GetUserRazgovori;

public sealed class UserRazgovorDto
{
    public int RazgovorId { get; set; }
    public int KupacId { get; set; }
    public int MajstorId { get; set; }
    public string KupacIme { get; set; } = string.Empty;
    public string MajstorIme { get; set; } = string.Empty;
    public string OglasNaslov { get; set; } = string.Empty;
    public string ZadnjaPoruka { get; set; } = string.Empty;
    public DateTime VrijemeZadnjePoruke { get; set; }
    public int BrojNeprocitanih { get; set; }
}
