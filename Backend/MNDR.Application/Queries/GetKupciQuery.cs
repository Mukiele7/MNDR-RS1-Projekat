using MediatR;
using MNDR.Application.DTOs;

namespace MNDR.Application.Queries
{
    public class GetKupciQuery : IRequest<PagedKupciResult>
    {
        // Filter 1: Grad
        public string? Grad { get; set; }
        // Filter 2: Općina
        public string? Opcina { get; set; }
        // Filter 3: Search term (ime ili prezime)
        public string? SearchTerm { get; set; }
        // Filter 4: Minimalna ocjena pouzdanosti
        public decimal? MinOcjena { get; set; }
        // Filter 5: Minimalan broj narudžbi
        public int? MinBrojNarudzbi { get; set; }

        // Paging
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class GetKupacByIdQuery : IRequest<KorisnikDto?>
    {
        public int KorisnikId { get; set; }
    }
}
