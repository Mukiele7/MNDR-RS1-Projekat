namespace MNDR.Application.Modules.Notifikacije.Queries.GetNotifikacije;

public sealed class GetNotifikacijeQueryHandler : IRequestHandler<GetNotifikacijeQuery, List<NotifikacijaDto>>
{
    private readonly IAppDbContext _context;

    public GetNotifikacijeQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<NotifikacijaDto>> Handle(GetNotifikacijeQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Notifikacije.Where(n => n.KorisnikId == request.KorisnikId);

        if (request.SamoNeprocitane.HasValue && request.SamoNeprocitane.Value)
            query = query.Where(n => !n.Procitano);

        var notifikacije = await query
            .OrderByDescending(n => n.DatumSlanja)
            .ToListAsync(cancellationToken);

        var dtoList = notifikacije.Select(n => new NotifikacijaDto
        {
            NotifikacijaId = n.NotifikacijaId,
            MajstorId = n.KorisnikId,
            Poruka = n.Sadrzaj,
            Tip = n.TipNotifikacije,
            DatumKreiranja = n.DatumSlanja,
            Procitana = n.Procitano
        }).ToList();

        return dtoList;
    }
}
