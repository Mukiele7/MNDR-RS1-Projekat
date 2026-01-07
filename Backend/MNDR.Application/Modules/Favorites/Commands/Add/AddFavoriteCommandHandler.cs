namespace MNDR.Application.Modules.Favorites.Commands.Add;

public class AddFavoriteCommandHandler(IAppDbContext context) : IRequestHandler<AddFavoriteCommand, bool>
{
    public async Task<bool> Handle(AddFavoriteCommand request, CancellationToken cancellationToken)
    {
        // Proveri da li vec postoji
        var existing = await context.OmiljeniMajstori
            .FirstOrDefaultAsync(om => om.KupacId == request.KupacId && om.MajstorId == request.MajstorId, cancellationToken);

        if (existing != null)
            return false; // Vec postoji

        var favorite = new OmiljeniMajstor
        {
            KupacId = request.KupacId,
            MajstorId = request.MajstorId,
            DatumDodavanja = DateTime.UtcNow
        };

        context.OmiljeniMajstori.Add(favorite);
        await context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
