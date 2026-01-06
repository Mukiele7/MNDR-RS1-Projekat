namespace MNDR.Application.Modules.Kupci.Commands.Delete;

public class DeleteKupacCommandHandler(IAppDbContext context)
    : IRequestHandler<DeleteKupacCommand>
{
    public async Task Handle(DeleteKupacCommand request, CancellationToken cancellationToken)
    {
        var kupac = await context.Kupci
            .Include(k => k.Korisnik)
            .FirstOrDefaultAsync(k => k.KorisnikId == request.KorisnikId, cancellationToken);

        if (kupac == null)
            throw new NotFoundException($"Kupac sa ID {request.KorisnikId} nije pronađen");

        // Obriši kupca
        context.Kupci.Remove(kupac);

        // Obriši korisnika
        if (kupac.Korisnik != null)
            context.Korisnici.Remove(kupac.Korisnik);

        await context.SaveChangesAsync(cancellationToken);
    }
}
