using MediatR;
using Microsoft.EntityFrameworkCore;
using MNDR.Application.Abstractions;
using MNDR.Application.Queries;

namespace MNDR.Application.Handlers.QueryHandlers;

public class GetPortfolioSlikeQueryHandler : IRequestHandler<GetPortfolioSlikeQuery, GetPortfolioSlikeResponse>
{
    private readonly IAppDbContext _context;

    public GetPortfolioSlikeQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<GetPortfolioSlikeResponse> Handle(GetPortfolioSlikeQuery request, CancellationToken cancellationToken)
    {
        // Provjera da li majstor postoji
        var majstorExists = await _context.Majstori
            .AnyAsync(m => m.KorisnikId == request.MajstorId, cancellationToken);

        if (!majstorExists)
        {
            return new GetPortfolioSlikeResponse
            {
                Success = false,
                Message = "Majstor sa datim ID-jem ne postoji"
            };
        }

        // Dohvati sve portfolio slike za majstora
        var slike = await _context.PortfolioSlike
            .Where(ps => ps.MajstorId == request.MajstorId)
            .OrderByDescending(ps => ps.JeIstaknuta)
            .ThenByDescending(ps => ps.DatumKreiranja)
            .Select(ps => new PortfolioSlikaDto
            {
                PortfolioSlikaId = ps.PortfolioSlikaId,
                MajstorId = ps.MajstorId,
                SlikaUrl = ps.SlikaUrl,
                Opis = ps.Opis,
                JeIstaknuta = ps.JeIstaknuta,
                DatumKreiranja = ps.DatumKreiranja
            })
            .ToListAsync(cancellationToken);

        return new GetPortfolioSlikeResponse
        {
            Success = true,
            Message = $"Pronađeno {slike.Count} slika",
            Slike = slike
        };
    }
}
