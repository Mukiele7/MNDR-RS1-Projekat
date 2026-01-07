namespace MNDR.Application.Modules.Favorites.Queries.GetFavorites;

public class GetFavoritesQueryHandler(IAppDbContext context) : IRequestHandler<GetFavoritesQuery, GetFavoritesResult>
{
    public async Task<GetFavoritesResult> Handle(GetFavoritesQuery request, CancellationToken cancellationToken)
    {
        var query = context.OmiljeniMajstori
            .Where(om => om.KupacId == request.KupacId)
            .Include(om => om.Majstor)
            .AsQueryable();

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(om => om.DatumDodavanja)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Join(
                context.Majstori.Include(m => m.Korisnik),
                om => om.MajstorId,
                m => m.KorisnikId,
                (om, m) => new FavoriteMajstorDto
                {
                    KorisnikId = m.KorisnikId,
                    Ime = m.Korisnik!.Ime,
                    Prezime = m.Korisnik.Prezime,
                    Email = m.Korisnik.Email,
                    Telefon = m.Korisnik.Telefon,
                    Grad = m.Korisnik.Grad,
                    Specijalizacija = m.Specijalizacija,
                    GodineIskustva = m.GodineIskustva,
                    CijenaMjesecne = m.CijenaMjesecne,
                    CijenaSat = m.CijenaSat,
                    ProsjecnaOcjena = m.ProsjecnaOcjena,
                    BrojZavrsenihPoslova = m.BrojZavrsenihPoslova,
                    DatumDodavanja = om.DatumDodavanja
                })
            .ToListAsync(cancellationToken);

        return new GetFavoritesResult
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
    }
}
