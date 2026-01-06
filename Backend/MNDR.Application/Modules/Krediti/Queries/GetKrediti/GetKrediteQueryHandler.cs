namespace MNDR.Application.Modules.Krediti.Queries.GetKrediti;

public sealed class GetKrediteQueryHandler : IRequestHandler<GetKrediteQuery, List<KreditDto>>
{
    private readonly IAppDbContext _context;

    public GetKrediteQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<KreditDto>> Handle(GetKrediteQuery request, CancellationToken cancellationToken)
    {
        var krediti = await _context.Krediti
            .Where(k => k.MajstorId == request.KorisnikId)
            .Include(k => k.Majstor)
                .ThenInclude(m => m.Korisnik)
            .Select(k => new KreditDto
            {
                KreditId = k.TransakcijaKreditaId,
                KorisnikId = k.MajstorId,
                KorisnikIme = k.Majstor!.Korisnik!.Ime + " " + k.Majstor.Korisnik.Prezime,
                Kolicina = (int)k.Iznos,
                Tip = k.NacinPlacanja,
                DatumTransakcije = k.DatumTransakcija,
                Status = k.StatusTransakcije
            })
            .OrderByDescending(k => k.DatumTransakcije)
            .ToListAsync(cancellationToken);

        return krediti;
    }
}
