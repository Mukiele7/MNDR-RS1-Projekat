namespace MNDR.Application.Modules.Ugovori.Queries.GetUgovori;

public sealed class GetUgovoreQuery : IRequest<List<UgovorDto>>
{
    public required int KorisnikId { get; set; }
}
