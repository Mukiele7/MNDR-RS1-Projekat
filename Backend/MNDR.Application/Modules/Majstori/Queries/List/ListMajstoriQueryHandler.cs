namespace MNDR.Application.Modules.Majstori.Queries.List;

public class ListMajstoriQueryHandler(IAppDbContext context)
    : IRequestHandler<ListMajstoriQuery, PagedMajstoriResult>
{
    public async Task<PagedMajstoriResult> Handle(ListMajstoriQuery request, CancellationToken cancellationToken)
    {
        var query = context.Majstori
            .Include(m => m.Korisnik)
            .Where(m => m.Korisnik != null)
            .AsQueryable();

        // Filter 1: Specijalizacija
        if (!string.IsNullOrEmpty(request.Specijalizacija))
            query = query.Where(m => m.Specijalizacija.Contains(request.Specijalizacija));

        // Filter 2: Grad
        if (!string.IsNullOrEmpty(request.Grad))
            query = query.Where(m => m.Korisnik!.Grad == request.Grad);

        // Filter 3: Općina
        if (!string.IsNullOrEmpty(request.Opcina))
            query = query.Where(m => m.Korisnik!.Opcina == request.Opcina);

        // Filter 4: Search term (ime ili prezime)
        if (!string.IsNullOrEmpty(request.SearchTerm))
            query = query.Where(m => 
                m.Korisnik!.Ime.Contains(request.SearchTerm) || 
                m.Korisnik.Prezime.Contains(request.SearchTerm));

        // Filter 5: MinGodineIskustva
        if (request.MinGodineIskustva.HasValue)
            query = query.Where(m => m.GodineIskustva >= request.MinGodineIskustva.Value);

        // Filter 6: MaxCijenaMjesecne
        if (request.MaxCijenaMjesecne.HasValue)
            query = query.Where(m => m.CijenaMjesecne <= request.MaxCijenaMjesecne.Value);

        // Filter 7: MinProsjecnaOcjena
        if (request.MinProsjecnaOcjena.HasValue)
            query = query.Where(m => m.ProsjecnaOcjena >= request.MinProsjecnaOcjena.Value);

        // Sorting
        if (!string.IsNullOrEmpty(request.SortBy))
        {
            query = request.SortBy.ToLower() switch
            {
                "ime" => request.SortOrder == "desc"
                    ? query.OrderByDescending(m => m.Korisnik!.Ime)
                    : query.OrderBy(m => m.Korisnik!.Ime),
                "specijalizacija" => request.SortOrder == "desc"
                    ? query.OrderByDescending(m => m.Specijalizacija)
                    : query.OrderBy(m => m.Specijalizacija),
                "prosjecnaocjena" => request.SortOrder == "desc"
                    ? query.OrderByDescending(m => m.ProsjecnaOcjena)
                    : query.OrderBy(m => m.ProsjecnaOcjena),
                "cijenamjesecne" => request.SortOrder == "desc"
                    ? query.OrderByDescending(m => m.CijenaMjesecne)
                    : query.OrderBy(m => m.CijenaMjesecne),
                "godineiskustva" => request.SortOrder == "desc"
                    ? query.OrderByDescending(m => m.GodineIskustva)
                    : query.OrderBy(m => m.GodineIskustva),
                _ => query.OrderBy(m => m.Korisnik!.Ime)
            };
        }
        else
        {
            query = query.OrderBy(m => m.Korisnik!.Ime);
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(m => new ListMajstoriQueryDto
            {
                KorisnikId = m.KorisnikId,
                Ime = m.Korisnik!.Ime,
                Prezime = m.Korisnik.Prezime,
                Email = m.Korisnik.Email,
                Telefon = m.Korisnik.Telefon,
                Grad = m.Korisnik.Grad,
                Opcina = m.Korisnik.Opcina,
                Specijalizacija = m.Specijalizacija,
                GodineIskustva = m.GodineIskustva,
                CijenaMjesecne = m.CijenaMjesecne,
                CijenaSat = m.CijenaSat,
                ProsjecnaOcjena = m.ProsjecnaOcjena,
                BrojZavrsenihPoslova = m.BrojZavrsenihPoslova,
                DetaljanOpisProfila = m.DetaljanOpisProfila,
                DatumRegistracije = m.Korisnik.DatumRegistracije,
                Latitude = m.Latitude,
                Longitude = m.Longitude
            })
            .ToListAsync(cancellationToken);

        return new PagedMajstoriResult
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
    }
}
