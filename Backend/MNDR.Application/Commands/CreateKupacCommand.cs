using MediatR;
using Microsoft.AspNetCore.Http;

namespace MNDR.Application.Commands
{
    public class CreateKupacCommand : IRequest<CreateKupacResponse>
    {
        public string Ime { get; set; } = string.Empty;
        public string Prezime { get; set; } = string.Empty;
        public string? KorisnickoIme { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Telefon { get; set; } = string.Empty;
        public string Lozinka { get; set; } = string.Empty;
        public string? Grad { get; set; }
        public string? Opcina { get; set; }
        public string? OpisProfila { get; set; }
        public IFormFile? SlikaProfila { get; set; }
    }

    public class CreateKupacResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public int KupacId { get; set; }
    }

    public class UpdateKupacCommand : IRequest<UpdateKupacResponse>
    {
        public int KorisnikId { get; set; }
        public string Ime { get; set; } = string.Empty;
        public string Prezime { get; set; } = string.Empty;
        public string? Grad { get; set; }
        public string? Opcina { get; set; }
        public string? Adresa { get; set; }
    }

    public class UpdateKupacResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    public class DeleteKupacCommand : IRequest<DeleteKupacResponse>
    {
        public int KorisnikId { get; set; }
    }

    public class DeleteKupacResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
