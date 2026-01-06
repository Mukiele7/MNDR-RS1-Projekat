namespace MNDR.Application.Modules.Majstori.Commands.Update;

public class UpdateMajstorCommandHandler(IAppDbContext context)
    : IRequestHandler<UpdateMajstorCommand>
{
    public async Task Handle(UpdateMajstorCommand request, CancellationToken cancellationToken)
    {
        var majstor = await context.Majstori
            .Include(m => m.Korisnik)
            .FirstOrDefaultAsync(m => m.KorisnikId == request.KorisnikId, cancellationToken);

        if (majstor?.Korisnik == null)
            throw new NotFoundException($"Majstor sa ID {request.KorisnikId} nije pronađen");

        // Ažuriraj korisnika
        majstor.Korisnik.Ime = request.Ime.Trim();
        majstor.Korisnik.Prezime = request.Prezime.Trim();
        majstor.Korisnik.Grad = request.Grad?.Trim();
        majstor.Korisnik.Opcina = request.Opcina?.Trim();
        majstor.Korisnik.OpisProfila = request.OpisProfila?.Trim();

        // Ažuriraj majstora
        majstor.Specijalizacija = request.Specijalizacija.Trim();
        majstor.GodineIskustva = request.GodineIskustva;
        majstor.CijenaMjesecne = request.CijenaMjesecne;
        majstor.CijenaSat = request.CijenaSat;
        majstor.DetaljanOpisProfila = request.DetaljanOpisProfila?.Trim();

        await context.SaveChangesAsync(cancellationToken);
    }
}
