namespace MNDR.Application.Modules.Majstori.Commands.Delete;

public class DeleteMajstorCommandHandler(IAppDbContext context)
    : IRequestHandler<DeleteMajstorCommand>
{
    public async Task Handle(DeleteMajstorCommand request, CancellationToken cancellationToken)
    {
        var majstor = await context.Majstori
            .Include(m => m.Korisnik)
            .FirstOrDefaultAsync(m => m.KorisnikId == request.KorisnikId, cancellationToken);

        if (majstor == null)
            throw new NotFoundException($"Majstor sa ID {request.KorisnikId} nije pronađen");

        // Obriši majstora
        context.Majstori.Remove(majstor);

        // Obriši korisnika
        if (majstor.Korisnik != null)
            context.Korisnici.Remove(majstor.Korisnik);

        await context.SaveChangesAsync(cancellationToken);
    }
}
