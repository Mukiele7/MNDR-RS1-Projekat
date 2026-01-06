using MediatR;
using MNDR.Application.DTOs;

namespace MNDR.Application.Queries
{
    public class GetMajstoriQuery : IRequest<PagedMajstoriResult>
    {
        // Filter 1: Specijalizacija
        public string? Specijalizacija { get; set; }
        // Filter 2: Minimalna ocjena
        public decimal? MinOcjena { get; set; }
        // Filter 3: Grad
        public string? Grad { get; set; }
        // Filter 4: Minimalne godine iskustva
        public int? MinGodineIskustva { get; set; }
        // Filter 5: Maksimalna cijena mjesečne
        public decimal? MaxCijena { get; set; }

        // Paging
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class GetMajstorByIdQuery : IRequest<MajstorDto?>
    {
        public int KorisnikId { get; set; }
    }
}
