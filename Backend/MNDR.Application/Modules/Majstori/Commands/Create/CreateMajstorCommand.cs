namespace MNDR.Application.Modules.Majstori.Commands.Create;

public class CreateMajstorCommand : IRequest<CreateMajstorResponse>
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
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
}

public class CreateMajstorResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public int MajstorId { get; set; }
}
