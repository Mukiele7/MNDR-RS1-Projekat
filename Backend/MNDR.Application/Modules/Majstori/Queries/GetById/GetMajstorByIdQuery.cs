namespace MNDR.Application.Modules.Majstori.Queries.GetById;

public class GetMajstorByIdQuery : IRequest<GetMajstorByIdQueryDto?>
{
    public int KorisnikId { get; set; }
}
