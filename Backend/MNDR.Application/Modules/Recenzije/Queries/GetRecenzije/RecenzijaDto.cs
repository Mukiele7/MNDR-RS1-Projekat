namespace MNDR.Application.Modules.Recenzije.Queries.GetRecenzije;

public sealed class RecenzijaDto
{
    public int RecenzijaId { get; set; }
    public int MajstorId { get; set; }
    public int KupacId { get; set; }
    public string KupacIme { get; set; } = string.Empty;
    public int Ocena { get; set; }
    public string Komentar { get; set; } = string.Empty;
    public DateTime DatumRecenzije { get; set; }
}
