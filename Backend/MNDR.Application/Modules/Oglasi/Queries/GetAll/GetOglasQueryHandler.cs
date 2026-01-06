namespace MNDR.Application.Modules.Oglasi.Queries.GetAll;

public sealed class GetOglasQueryHandler : IRequestHandler<GetOglasQuery, PagedOglasResult>
{
    private readonly IAppDbContext _context;

    public GetOglasQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<PagedOglasResult> Handle(GetOglasQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Oglasi.AsQueryable();

        // Filter 1: Status
        if (!string.IsNullOrEmpty(request.Status))
            query = query.Where(o => o.Status == request.Status);

        // Filter 2: MajstorId
        if (request.MajstorId.HasValue)
            query = query.Where(o => o.MajstorId == request.MajstorId.Value);

        // Filter 3: KategorijaId
        if (request.KategorijaId.HasValue)
            query = query.Where(o => o.OglasKategorije.Any(ok => ok.KategorijaId == request.KategorijaId.Value));

        // Filter 4: SearchTerm (pretraga po naslovu i opisu)
        if (!string.IsNullOrEmpty(request.SearchTerm))
            query = query.Where(o => o.Naslov.Contains(request.SearchTerm) || o.Opis.Contains(request.SearchTerm));

        // Filter 5: DatumOd
        if (request.DatumOd.HasValue)
            query = query.Where(o => o.DatumObjave >= request.DatumOd.Value);

        // Filter 6: DatumDo
        if (request.DatumDo.HasValue)
            query = query.Where(o => o.DatumObjave <= request.DatumDo.Value);

        // Filter 7: Grad majstora
        if (!string.IsNullOrEmpty(request.Grad))
            query = query.Where(o => o.Majstor != null && o.Majstor.Korisnik != null && o.Majstor.Korisnik.Grad == request.Grad);

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Include(o => o.Majstor)
            .ThenInclude(m => m!.Korisnik)
            .Include(o => o.OglasKategorije)
            .ThenInclude(ok => ok.Kategorija)
            .Select(o => new OglasQueryDto
            {
                OglasId = o.OglasId,
                MajstorId = o.MajstorId,
                Naslov = o.Naslov,
                Opis = o.Opis,
                DatumObjave = o.DatumObjave,
                Status = o.Status,
                MajstorIme = o.Majstor!.Korisnik!.Ime + " " + o.Majstor.Korisnik.Prezime,
                Grad = o.Majstor!.Korisnik!.Grad,
                Kategorije = o.OglasKategorije.Select(ok => ok.Kategorija!.Naziv).ToList()
            })
            .ToListAsync(cancellationToken);

        return new PagedOglasResult
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
    }
}
