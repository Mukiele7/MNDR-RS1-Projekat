using MNDR.Application.DTOs;

namespace MNDR.Application.Queries
{
    public class PagedKupciResult
    {
        public List<KorisnikDto> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    }
}
