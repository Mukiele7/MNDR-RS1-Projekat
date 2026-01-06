namespace MNDR.Application.Modules.Razgovori.Queries.GetUserRazgovori;

public sealed class UserRazgovorDto
{
    public int RazgovorId { get; set; }
    public string Naziv { get; set; } = string.Empty;
    public string OglasNaslov { get; set; } = string.Empty;
    public DateTime DatumUpdate { get; set; }
    public int BrojNeprocitanih { get; set; }
}
