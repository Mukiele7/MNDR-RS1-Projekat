namespace MNDR.Application.Modules.Favorites.Queries.GetFavorites;

public class GetFavoritesQuery : IRequest<GetFavoritesResult>
{
    public int KupacId { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetFavoritesResult
{
    public List<FavoriteMajstorDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
}

public class FavoriteMajstorDto
{
    public int KorisnikId { get; set; }
    public string Ime { get; set; } = string.Empty;
    public string Prezime { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefon { get; set; } = string.Empty;
    public string Grad { get; set; } = string.Empty;
    public string Specijalizacija { get; set; } = string.Empty;
    public int GodineIskustva { get; set; }
    public decimal CijenaMjesecne { get; set; }
    public decimal CijenaSat { get; set; }
    public decimal ProsjecnaOcjena { get; set; }
    public int BrojZavrsenihPoslova { get; set; }
    public DateTime DatumDodavanja { get; set; }
}
