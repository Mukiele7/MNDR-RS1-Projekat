namespace MNDR.Application.Modules.Notifikacije.Queries.GetNotifikacije;

public sealed class GetNotifikacijeQuery : IRequest<List<NotifikacijaDto>>
{
    public required int KorisnikId { get; set; }
    public bool? SamoNeprocitane { get; set; }
}
