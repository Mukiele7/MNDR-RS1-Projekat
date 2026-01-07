namespace MNDR.Application.Modules.Ugovori.Queries.GetUgovori;

public sealed class GetUgovoreQuery : IRequest<List<UgovorDto>>
{
    public required int KorisnikId { get; set; }
    
    // Sorting
    public string? SortBy { get; set; } // DatumKreiranja, Status, Cena, DatumOd
    public string SortOrder { get; set; } = "desc"; // asc or desc
}
