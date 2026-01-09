using MediatR;

namespace MNDR.Application.Commands;

public class SetFeaturedSlikaCommand : IRequest<SetFeaturedSlikaResponse>
{
    public int PortfolioSlikaId { get; set; }
    public int MajstorId { get; set; }
    public bool JeIstaknuta { get; set; }
}

public class SetFeaturedSlikaResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}
