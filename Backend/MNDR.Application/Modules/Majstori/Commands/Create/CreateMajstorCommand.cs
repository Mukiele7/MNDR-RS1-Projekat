namespace MNDR.Application.Modules.Majstori.Commands.Create;

public class CreateMajstorCommand : IRequest<int>
{
    public string Ime { get; set; } = string.Empty;
    public string Prezime { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefon { get; set; } = string.Empty;
    public string Lozinka { get; set; } = string.Empty;
    public string? Grad { get; set; }
    public string? Opcina { get; set; }
    public string Specijalizacija { get; set; } = string.Empty;
    public int GodineIskustva { get; set; }
    public decimal CijenaMjesecne { get; set; }
    public string? DetaljanOpisProfila { get; set; }
}
