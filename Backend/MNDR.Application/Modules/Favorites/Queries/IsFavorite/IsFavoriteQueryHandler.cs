namespace MNDR.Application.Modules.Favorites.Queries.IsFavorite;

public class IsFavoriteQueryHandler(IAppDbContext context) : IRequestHandler<IsFavoriteQuery, bool>
{
    public async Task<bool> Handle(IsFavoriteQuery request, CancellationToken cancellationToken)
    {
        return await context.OmiljeniMajstori
            .AnyAsync(om => om.KupacId == request.KupacId && om.MajstorId == request.MajstorId, cancellationToken);
    }
}
