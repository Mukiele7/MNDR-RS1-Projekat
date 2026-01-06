namespace MNDR.Application.Modules.Majstori.Queries.GetById;

public class GetMajstorByIdQueryHandler(IAppDbContext context)
    : IRequestHandler<GetMajstorByIdQuery, GetMajstorByIdQueryDto?>
{
    public async Task<GetMajstorByIdQueryDto?> Handle(GetMajstorByIdQuery request, CancellationToken cancellationToken)
    {
        var majstor = await context.Majstori
            .Include(m => m.Korisnik)
            .Where(m => m.KorisnikId == request.KorisnikId)
            .Select(m => new GetMajstorByIdQueryDto
            {
                KorisnikId = m.KorisnikId,
                Ime = m.Korisnik!.Ime,
                Prezime = m.Korisnik.Prezime,
                Email = m.Korisnik.Email,
                Telefon = m.Korisnik.Telefon,
                Grad = m.Korisnik.Grad,
                Opcina = m.Korisnik.Opcina,
                OpisProfila = m.Korisnik.OpisProfila,
                SlikaProfila = m.Korisnik.SlikaProfila,
                Specijalizacija = m.Specijalizacija,
                GodineIskustva = m.GodineIskustva,
                CijenaMjesecne = m.CijenaMjesecne,
                CijenaSat = m.CijenaSat,
                ProsjecnaOcjena = m.ProsjecnaOcjena,
                BrojZavrsenihPoslova = m.BrojZavrsenihPoslova,
                DetaljanOpisProfila = m.DetaljanOpisProfila,
                DatumRegistracije = m.Korisnik.DatumRegistracije
            })
            .FirstOrDefaultAsync(cancellationToken);

        return majstor;
    }
}
