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
            .Where(r => r.MajstorId == request.MajstorId)
            .Include(r => r.Kupac)
            .ThenInclude(k => k!.Korisnik)
            .Select(r => new RecenzijaDto
            {
                RecenzijaId = r.RecenzijaId,
                MajstorId = r.MajstorId,
                KupacId = r.KupacId,
                KupacIme = r.Kupac!.Korisnik!.Ime + " " + r.Kupac.Korisnik.Prezime,
                Ocena = r.Ocena,
                Komentar = r.Komentar,
                DatumRecenzije = r.DatumRecenzije
            })
            .OrderByDescending(r => r.DatumRecenzije)
            .ToListAsync(cancellationToken);

        return recenzije;
    }
}
