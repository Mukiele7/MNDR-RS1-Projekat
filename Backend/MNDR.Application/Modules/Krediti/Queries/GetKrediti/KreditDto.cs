namespace MNDR.Application.Modules.Krediti.Queries.GetKrediti;

public sealed class KreditDto
{
    public int KreditId { get; set; }
    public int KorisnikId { get; set; }
    public string KorisnikIme { get; set; } = string.Empty;
    public decimal Kolicina { get; set; }
    public string Tip { get; set; } = string.Empty;
    public DateTime DatumTransakcije { get; set; }
    public string Status { get; set; } = string.Empty;
}
