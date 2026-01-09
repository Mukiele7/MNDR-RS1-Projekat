namespace MNDR.Application.Modules.Kupci.Queries.List;

public class ListKupciQuery : IRequest<PagedKupciResult>
{
    public string? Grad { get; set; }
    public string? Opcina { get; set; }
    public string? SearchTerm { get; set; }
    public decimal? MinOcjena { get; set; }
    public int? MinBrojNarudzbi { get; set; }

    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
