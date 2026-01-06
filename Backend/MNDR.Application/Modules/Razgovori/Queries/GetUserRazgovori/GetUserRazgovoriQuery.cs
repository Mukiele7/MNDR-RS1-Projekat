namespace MNDR.Application.Modules.Razgovori.Queries.GetUserRazgovori;

public sealed class GetUserRazgovoriQuery : IRequest<List<UserRazgovorDto>>
{
    public required int KorisnikId { get; set; }
}
