namespace MNDR.Application.Modules.Majstori.Queries.List;

public class PagedMajstoriResult
{
    public List<ListMajstoriQueryDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}
