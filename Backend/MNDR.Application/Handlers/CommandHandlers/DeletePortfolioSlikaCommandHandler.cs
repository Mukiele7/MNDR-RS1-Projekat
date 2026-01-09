using MediatR;
using Microsoft.EntityFrameworkCore;
using MNDR.Application.Abstractions;
using MNDR.Application.Commands;

namespace MNDR.Application.Handlers.CommandHandlers;

public class DeletePortfolioSlikaCommandHandler : IRequestHandler<DeletePortfolioSlikaCommand, DeletePortfolioSlikaResponse>
{
    private readonly IAppDbContext _context;

    public DeletePortfolioSlikaCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<DeletePortfolioSlikaResponse> Handle(DeletePortfolioSlikaCommand request, CancellationToken cancellationToken)
    {
        // Pronađi sliku
        var portfolioSlika = await _context.PortfolioSlike
            .FirstOrDefaultAsync(ps => ps.PortfolioSlikaId == request.PortfolioSlikaId, cancellationToken);

        if (portfolioSlika == null)
        {
            return new DeletePortfolioSlikaResponse
            {
                Success = false,
                Message = "Slika nije pronađena"
            };
        }

        // Provjera vlasništva - samo vlasnik može obrisati
        if (portfolioSlika.MajstorId != request.MajstorId)
        {
            return new DeletePortfolioSlikaResponse
            {
                Success = false,
                Message = "Nemate dozvolu da obrišete ovu sliku"
            };
        }

        _context.PortfolioSlike.Remove(portfolioSlika);
        await _context.SaveChangesAsync(cancellationToken);

        return new DeletePortfolioSlikaResponse
        {
            Success = true,
            Message = "Slika uspješno obrisana"
        };
    }
}
