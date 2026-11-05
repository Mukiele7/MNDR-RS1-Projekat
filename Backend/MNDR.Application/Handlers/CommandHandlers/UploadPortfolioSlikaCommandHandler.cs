using MediatR;
using MNDR.Application.Abstractions;
using MNDR.Application.Commands;
using MNDR.Domain.Entities;
using Microsoft.AspNetCore.Http;

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
        if (request.Slika is null && string.IsNullOrWhiteSpace(request.SlikaUrl))
        {
            return new UploadPortfolioSlikaResponse
            {
                Success = false,
                Message = "Slika ili URL slike je obavezan"
            };
        }

        var slikaUrl = request.SlikaUrl;
        if (request.Slika is not null)
        {
            var allowedContentTypes = new[] { "image/jpeg", "image/png", "image/webp", "image/gif" };
            if (!allowedContentTypes.Contains(request.Slika.ContentType, StringComparer.OrdinalIgnoreCase))
            {
                return new UploadPortfolioSlikaResponse
                {
                    Success = false,
                    Message = "Dozvoljeni su samo JPG, PNG, WEBP i GIF fajlovi"
                };
            }

            if (request.Slika.Length > 5 * 1024 * 1024)
            {
                return new UploadPortfolioSlikaResponse
                {
                    Success = false,
                    Message = "Maksimalna veličina slike je 5 MB"
                };
            }

            var extension = Path.GetExtension(request.Slika.FileName).ToLowerInvariant();
            var fileName = $"{Guid.NewGuid():N}{extension}";
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "portfolio");
            Directory.CreateDirectory(uploadsFolder);

            var filePath = Path.Combine(uploadsFolder, fileName);
            await using var stream = File.Create(filePath);
            await request.Slika.CopyToAsync(stream, cancellationToken);
            slikaUrl = $"/uploads/portfolio/{fileName}";
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
            SlikaUrl = slikaUrl!,
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
