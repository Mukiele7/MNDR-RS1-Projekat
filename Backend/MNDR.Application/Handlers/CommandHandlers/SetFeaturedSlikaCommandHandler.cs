using MediatR;
using Microsoft.EntityFrameworkCore;
using MNDR.Application.Abstractions;
using MNDR.Application.Commands;

namespace MNDR.Application.Handlers.CommandHandlers;

public class SetFeaturedSlikaCommandHandler : IRequestHandler<SetFeaturedSlikaCommand, SetFeaturedSlikaResponse>
{
    private readonly IAppDbContext _context;

    public SetFeaturedSlikaCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<SetFeaturedSlikaResponse> Handle(SetFeaturedSlikaCommand request, CancellationToken cancellationToken)
    {
        var slika = await _context.PortfolioSlike
            .FirstOrDefaultAsync(ps => ps.PortfolioSlikaId == request.PortfolioSlikaId, cancellationToken);

        if (slika == null)
        {
            return new SetFeaturedSlikaResponse
            {
                Success = false,
                Message = "Slika nije pronađena"
            };
        }

        // Provjera da li slika pripada majstoru
        if (slika.MajstorId != request.MajstorId)
        {
            return new SetFeaturedSlikaResponse
            {
                Success = false,
                Message = "Nemate dozvolu za izmjenu ove slike"
            };
        }

        // Ako se postavlja kao istaknuta, provjeri da li već postoje 3 istaknutе
        if (request.JeIstaknuta)
        {
            var brojIstaknutih = await _context.PortfolioSlike
                .CountAsync(ps => ps.MajstorId == request.MajstorId && ps.JeIstaknuta, cancellationToken);

            if (brojIstaknutih >= 3)
            {
                return new SetFeaturedSlikaResponse
                {
                    Success = false,
                    Message = "Maksimalno 3 slike mogu biti istaknutе. Uklonite neku od trenutnih."
                };
            }
        }

        slika.JeIstaknuta = request.JeIstaknuta;
        await _context.SaveChangesAsync(cancellationToken);

        return new SetFeaturedSlikaResponse
        {
            Success = true,
            Message = request.JeIstaknuta ? "Slika je postavljena kao istaknuta" : "Slika je uklonjena iz istaknutih"
        };
    }
}
