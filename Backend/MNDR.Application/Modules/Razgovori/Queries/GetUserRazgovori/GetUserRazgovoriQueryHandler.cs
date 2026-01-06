namespace MNDR.Application.Modules.Razgovori.Queries.GetUserRazgovori;

public sealed class GetUserRazgovoriQueryHandler : IRequestHandler<GetUserRazgovoriQuery, List<UserRazgovorDto>>
{
    private readonly IAppDbContext _context;

    public GetUserRazgovoriQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserRazgovorDto>> Handle(GetUserRazgovoriQuery request, CancellationToken cancellationToken)
    {
        var razgovori = await _context.Razgovori
            .Where(r => r.KupacId == request.KorisnikId || r.MajstorId == request.KorisnikId)
            .Include(r => r.Oglas)
            .Include(r => r.Poruke)
            .OrderByDescending(r => r.DatumUpdate)
            .Select(r => new UserRazgovorDto
            {
                RazgovorId = r.RazgovorId,
                Naziv = r.KupacId == request.KorisnikId
                    ? r.Majstor!.Korisnik!.Ime
                    : r.Kupac!.Korisnik!.Ime,
                OglasNaslov = r.Oglas!.Naslov,
                DatumUpdate = r.DatumUpdate,
                BrojNeprocitanih = r.Poruke.Where(p => p.PosiljaocId != request.KorisnikId && p.Status == "Poslana").Count()
            })
            .ToListAsync(cancellationToken);

        return razgovori;
    }
}
