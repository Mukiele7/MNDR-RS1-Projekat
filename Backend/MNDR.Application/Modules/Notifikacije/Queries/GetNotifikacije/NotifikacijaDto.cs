namespace MNDR.Application.Modules.Notifikacije.Queries.GetNotifikacije;

public sealed class NotifikacijaDto
{
    public int NotifikacijaId { get; set; }
    public int MajstorId { get; set; }
    public string Poruka { get; set; } = string.Empty;
    public string Tip { get; set; } = string.Empty;
    public bool Procitana { get; set; }
    public DateTime DatumKreiranja { get; set; }
}
