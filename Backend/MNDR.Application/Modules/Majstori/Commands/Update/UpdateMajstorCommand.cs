namespace MNDR.Application.Modules.Majstori.Commands.Update;

public class UpdateMajstorCommand : IRequest<UpdateMajstorResponse>
{
    public int KorisnikId { get; set; }
    public string Ime { get; set; } = string.Empty;
    public string Prezime { get; set; } = string.Empty;
    public string? Grad { get; set; }
    public string? Opcina { get; set; }
    public string Specijalizacija { get; set; } = string.Empty;
    public int GodineIskustva { get; set; }
    public decimal CijenaMjesecne { get; set; }
    public decimal CijenaSat { get; set; }
    public string? DetaljanOpisProfila { get; set; }
    public string? OpisProfila { get; set; }
}

public class UpdateMajstorResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}
