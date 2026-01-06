namespace MNDR.Application.Modules.Krediti.Queries.GetKrediti;

public sealed class GetKrediteQuery : IRequest<List<KreditDto>>
{
    public required int KorisnikId { get; set; }
}
