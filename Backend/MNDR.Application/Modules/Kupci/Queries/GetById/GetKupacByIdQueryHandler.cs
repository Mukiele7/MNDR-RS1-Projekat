namespace MNDR.Application.Modules.Kupci.Queries.GetById;

public class GetKupacByIdQueryHandler(IAppDbContext context)
    : IRequestHandler<GetKupacByIdQuery, GetKupacByIdQueryDto?>
{
    public async Task<GetKupacByIdQueryDto?> Handle(GetKupacByIdQuery request, CancellationToken cancellationToken)
    {
        var kupac = await context.Kupci
            .Include(k => k.Korisnik)
            .Where(k => k.KorisnikId == request.KorisnikId)
            .Select(k => new GetKupacByIdQueryDto
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
            .FirstOrDefaultAsync(cancellationToken);

        return kupac;
    }
}
