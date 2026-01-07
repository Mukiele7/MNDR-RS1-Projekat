namespace MNDR.Application.Modules.Favorites.Commands.Add;

public class AddFavoriteCommand : IRequest<bool>
{
    public int KupacId { get; set; }
    public int MajstorId { get; set; }
}
