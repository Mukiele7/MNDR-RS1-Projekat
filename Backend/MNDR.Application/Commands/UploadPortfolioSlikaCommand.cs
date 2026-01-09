using MediatR;

namespace MNDR.Application.Commands;

public class UploadPortfolioSlikaCommand : IRequest<UploadPortfolioSlikaResponse>
{
    public int MajstorId { get; set; }
    public string SlikaUrl { get; set; } = string.Empty;
    public string? Opis { get; set; }
}

public class UploadPortfolioSlikaResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public int PortfolioSlikaId { get; set; }
}
