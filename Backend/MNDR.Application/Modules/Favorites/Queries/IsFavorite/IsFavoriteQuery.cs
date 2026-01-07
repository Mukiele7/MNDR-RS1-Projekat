namespace MNDR.Application.Modules.Favorites.Queries.IsFavorite;

public class IsFavoriteQuery : IRequest<bool>
{
    public int KupacId { get; set; }
    public int MajstorId { get; set; }
}
