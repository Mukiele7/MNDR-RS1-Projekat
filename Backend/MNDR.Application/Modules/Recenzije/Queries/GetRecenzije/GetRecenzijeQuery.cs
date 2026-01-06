namespace MNDR.Application.Modules.Recenzije.Queries.GetRecenzije;

public sealed class GetRecenzijeQuery : IRequest<List<RecenzijaDto>>
{
    public required int MajstorId { get; set; }
}
