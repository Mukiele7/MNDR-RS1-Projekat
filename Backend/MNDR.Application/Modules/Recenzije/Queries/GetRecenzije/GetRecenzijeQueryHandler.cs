namespace MNDR.Application.Modules.Recenzije.Queries.GetRecenzije;

public sealed class GetRecenzijeQueryHandler : IRequestHandler<GetRecenzijeQuery, List<RecenzijaDto>>
{
    private readonly IAppDbContext _context;

    public GetRecenzijeQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<RecenzijaDto>> Handle(GetRecenzijeQuery request, CancellationToken cancellationToken)
    {
        var recenzije = await _context.Recenzije
            .Include(r => r.Ugovor)
            .ThenInclude(u => u!.Kupac)
            .ThenInclude(k => k!.Korisnik)
            .Where(r => r.Ugovor!.Oglas!.MajstorId == request.MajstorId)
            .Select(r => new RecenzijaDto
            {
                RecenzijaId = r.RecenzijaId,
                MajstorId = r.Ugovor!.Oglas!.MajstorId,
                KupacId = r.Ugovor.KupacId,
                KupacIme = r.Ugovor.Kupac!.Korisnik!.Ime + " " + r.Ugovor.Kupac.Korisnik.Prezime,
                Ocena = r.Ocena,
                Komentar = r.Komentar,
                DatumRecenzije = r.DatumRecenzije
            })
            .OrderByDescending(r => r.DatumRecenzije)
            .ToListAsync(cancellationToken);

        return recenzije;
    }
}
