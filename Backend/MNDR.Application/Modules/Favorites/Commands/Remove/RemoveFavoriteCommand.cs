namespace MNDR.Application.Modules.Favorites.Commands.Remove;

public class RemoveFavoriteCommand : IRequest<bool>
{
    public int KupacId { get; set; }
    public int MajstorId { get; set; }
}
