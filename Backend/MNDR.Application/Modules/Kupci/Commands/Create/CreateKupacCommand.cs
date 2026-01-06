namespace MNDR.Application.Modules.Kupci.Commands.Create;

public class CreateKupacCommand : IRequest<int>
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
