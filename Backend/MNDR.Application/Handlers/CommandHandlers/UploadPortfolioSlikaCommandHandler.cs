using MediatR;
using MNDR.Application.Abstractions;
using MNDR.Application.Commands;
using MNDR.Domain.Entities;

namespace MNDR.Application.Handlers.CommandHandlers;

public class UploadPortfolioSlikaCommandHandler : IRequestHandler<UploadPortfolioSlikaCommand, UploadPortfolioSlikaResponse>
{
    private readonly IAppDbContext _context;

    public UploadPortfolioSlikaCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<UploadPortfolioSlikaResponse> Handle(UploadPortfolioSlikaCommand request, CancellationToken cancellationToken)
    {
        // Validacija URL-a
        if (string.IsNullOrWhiteSpace(request.SlikaUrl))
        {
            return new UploadPortfolioSlikaResponse
            {
                Success = false,
                Message = "URL slike je obavezan"
            };
        }

        // Validacija da li Majstor postoji
        var majstorExists = await _context.Majstori
            .AnyAsync(m => m.KorisnikId == request.MajstorId, cancellationToken);

        if (!majstorExists)
        {
            return new UploadPortfolioSlikaResponse
            {
                Success = false,
                Message = "Majstor sa datim ID-jem ne postoji"
            };
        }

        // Kreiranje nove portfolio slike
        var portfolioSlika = new PortfolioSlika
        {
            MajstorId = request.MajstorId,
            SlikaUrl = request.SlikaUrl,
            Opis = request.Opis,
            DatumKreiranja = DateTime.Now
        };

        _context.PortfolioSlike.Add(portfolioSlika);
        await _context.SaveChangesAsync(cancellationToken);

        return new UploadPortfolioSlikaResponse
        {
            Success = true,
            Message = "Slika uspješno dodana u portfolio",
            PortfolioSlikaId = portfolioSlika.PortfolioSlikaId
        };
    }
}
