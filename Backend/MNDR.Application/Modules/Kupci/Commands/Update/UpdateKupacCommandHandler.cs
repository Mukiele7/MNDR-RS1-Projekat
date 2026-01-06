namespace MNDR.Application.Modules.Kupci.Commands.Update;

public class UpdateKupacCommandHandler(IAppDbContext context)
    : IRequestHandler<UpdateKupacCommand>
{
    public async Task Handle(UpdateKupacCommand request, CancellationToken cancellationToken)
    {
        var kupac = await context.Kupci
            .Include(k => k.Korisnik)
            .FirstOrDefaultAsync(k => k.KorisnikId == request.KorisnikId, cancellationToken);

        if (kupac?.Korisnik == null)
            throw new NotFoundException($"Kupac sa ID {request.KorisnikId} nije pronađen");

        // Ažuriraj korisnika
        kupac.Korisnik.Ime = request.Ime.Trim();
        kupac.Korisnik.Prezime = request.Prezime.Trim();
        kupac.Korisnik.Grad = request.Grad?.Trim();
        kupac.Korisnik.Opcina = request.Opcina?.Trim();
        kupac.Korisnik.OpisProfila = request.Adresa?.Trim();

        await context.SaveChangesAsync(cancellationToken);
    }
}
