namespace MNDR.Application.Modules.Razgovori.Queries.GetById;

public sealed class GetRazgovorQuery : IRequest<RazgovorDetailDto>
{
    public required int RazgovorId { get; set; }
    public required int KorisnikId { get; set; }
}
