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
            .Include(r => r.Kupac)
                .ThenInclude(k => k!.Korisnik)
            .Include(r => r.Majstor)
                .ThenInclude(m => m!.Korisnik)
            .Include(r => r.Poruke)
            .OrderByDescending(r => r.DatumUpdate)
            .Select(r => new UserRazgovorDto
            {
                RazgovorId = r.RazgovorId,
                KupacId = r.KupacId,
                MajstorId = r.MajstorId,
                KupacIme = r.Kupac!.Korisnik!.Ime + " " + r.Kupac.Korisnik.Prezime,
                MajstorIme = r.Majstor!.Korisnik!.Ime + " " + r.Majstor.Korisnik.Prezime,
                OglasNaslov = r.Oglas!.Naslov,
                ZadnjaPoruka = r.Poruke.OrderByDescending(p => p.VrijemeSlanja).FirstOrDefault()!.Sadrzaj ?? "",
                VrijemeZadnjePoruke = r.Poruke.Any() 
                    ? r.Poruke.OrderByDescending(p => p.VrijemeSlanja).First().VrijemeSlanja 
                    : r.DatumKreiranja,
                BrojNeprocitanih = r.Poruke.Count(p => p.PosiljaocId != request.KorisnikId && p.Status == "Poslano")
            })
            .ToListAsync(cancellationToken);

        return razgovori;
    }
}
