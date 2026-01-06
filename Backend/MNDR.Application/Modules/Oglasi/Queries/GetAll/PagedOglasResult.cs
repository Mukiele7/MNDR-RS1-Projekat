namespace MNDR.Application.Modules.Oglasi.Queries.GetAll;

public sealed class PagedOglasResult
{
    public List<OglasQueryDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}
