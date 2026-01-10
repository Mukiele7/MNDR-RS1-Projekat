namespace MNDR.Application.Modules.Kupci.Queries.List;

public class ListKupciQueryHandler(IAppDbContext context)
    : IRequestHandler<ListKupciQuery, PagedKupciResult>
{
    public async Task<PagedKupciResult> Handle(ListKupciQuery request, CancellationToken cancellationToken)
    {
        var query = context.Kupci
            .Include(k => k.Korisnik)
            .Where(k => k.Korisnik != null)
            .AsQueryable();

        if (!string.IsNullOrEmpty(request.Grad))
            query = query.Where(k => k.Korisnik!.Grad == request.Grad);

        if (!string.IsNullOrEmpty(request.Opcina))
            query = query.Where(k => k.Korisnik!.Opcina == request.Opcina);

        if (!string.IsNullOrEmpty(request.SearchTerm))
            query = query.Where(k => 
                k.Korisnik!.Ime.Contains(request.SearchTerm) || 
                k.Korisnik.Prezime.Contains(request.SearchTerm));

        if (request.MinOcjena.HasValue)
            query = query.Where(k => k.OcjenaPouzdanosti >= request.MinOcjena.Value);

        if (request.MinBrojNarudzbi.HasValue)
            query = query.Where(k => k.BrojNarudzbi >= request.MinBrojNarudzbi.Value);

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(k => new ListKupciQueryDto
            {
                KorisnikId = k.KorisnikId,
                Ime = k.Korisnik!.Ime,
                Prezime = k.Korisnik.Prezime,
                Email = k.Korisnik.Email,
                Telefon = k.Korisnik.Telefon,
                Grad = k.Korisnik.Grad,
                Opcina = k.Korisnik.Opcina,
                OpisProfila = k.Korisnik.OpisProfila,
                SlikaProfila = k.Korisnik.SlikaProfila,
                OcjenaPouzdanosti = k.OcjenaPouzdanosti,
                BrojNarudzbi = k.BrojNarudzbi,
                DatumRegistracije = k.Korisnik.DatumRegistracije
            })
            .ToListAsync(cancellationToken);

        return new PagedKupciResult
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
    }
}
