using MediatR;

namespace MNDR.Application.Commands;

public class DeletePortfolioSlikaCommand : IRequest<DeletePortfolioSlikaResponse>
{
    public int PortfolioSlikaId { get; set; }
    public int MajstorId { get; set; } // For authorization - only owner can delete
}

public class DeletePortfolioSlikaResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}
