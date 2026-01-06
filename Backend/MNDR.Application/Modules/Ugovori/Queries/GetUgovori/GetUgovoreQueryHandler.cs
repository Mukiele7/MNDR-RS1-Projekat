namespace MNDR.Application.Modules.Ugovori.Queries.GetUgovori;

public sealed class GetUgovoreQueryHandler : IRequestHandler<GetUgovoreQuery, List<UgovorDto>>
{
    private readonly IAppDbContext _context;

    public GetUgovoreQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<UgovorDto>> Handle(GetUgovoreQuery request, CancellationToken cancellationToken)
    {
        var ugovori = await _context.Ugovori
            .Where(u => u.KupacId == request.KorisnikId || u.Oglas!.MajstorId == request.KorisnikId)
            .Include(u => u.Kupac)
            .ThenInclude(k => k!.Korisnik)
            .Include(u => u.Oglas)
            .Select(u => new UgovorDto
            {
                UgovorId = u.UgovorId,
                KupacId = u.KupacId,
                KupacIme = u.Kupac!.Korisnik!.Ime + " " + u.Kupac.Korisnik.Prezime,
                OglasId = u.OglasId,
                OglasNaslov = u.Oglas!.Naslov,
                DatumOd = u.DatumOd,
                DatumDo = u.DatumDo,
                Cena = u.Cena,
                Status = u.Status,
                DatumKreiranja = u.DatumKreiranja
            })
            .OrderByDescending(u => u.DatumKreiranja)
            .ToListAsync(cancellationToken);

        return ugovori;
    }
}
