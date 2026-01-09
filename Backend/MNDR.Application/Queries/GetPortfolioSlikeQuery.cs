using MediatR;

namespace MNDR.Application.Queries;

public class GetPortfolioSlikeQuery : IRequest<GetPortfolioSlikeResponse>
{
    public int MajstorId { get; set; }
}

public class GetPortfolioSlikeResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public List<PortfolioSlikaDto> Slike { get; set; } = new();
}

public class PortfolioSlikaDto
{
    public int PortfolioSlikaId { get; set; }
    public int MajstorId { get; set; }
    public string SlikaUrl { get; set; } = string.Empty;
    public string? Opis { get; set; }
    public bool JeIstaknuta { get; set; }
    public DateTime DatumKreiranja { get; set; }
}
