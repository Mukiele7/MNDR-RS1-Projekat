namespace MNDR.Application.Modules.Kupci.Queries.GetById;

public class GetKupacByIdQuery : IRequest<GetKupacByIdQueryDto?>
{
    public int KorisnikId { get; set; }
}
