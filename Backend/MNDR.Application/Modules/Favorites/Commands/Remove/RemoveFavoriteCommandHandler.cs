namespace MNDR.Application.Modules.Favorites.Commands.Remove;

public class RemoveFavoriteCommandHandler(IAppDbContext context) : IRequestHandler<RemoveFavoriteCommand, bool>
{
    public async Task<bool> Handle(RemoveFavoriteCommand request, CancellationToken cancellationToken)
    {
        var favorite = await context.OmiljeniMajstori
            .FirstOrDefaultAsync(om => om.KupacId == request.KupacId && om.MajstorId == request.MajstorId, cancellationToken);

        if (favorite == null)
            return false;

        context.OmiljeniMajstori.Remove(favorite);
        await context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
