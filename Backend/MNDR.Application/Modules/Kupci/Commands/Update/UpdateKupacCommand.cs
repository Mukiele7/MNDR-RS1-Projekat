namespace MNDR.Application.Modules.Kupci.Commands.Update;

public class UpdateKupacCommand : IRequest
{
    public int KorisnikId { get; set; }
    public string Ime { get; set; } = string.Empty;
    public string Prezime { get; set; } = string.Empty;
    public string? Grad { get; set; }
    public string? Opcina { get; set; }
    public string? Adresa { get; set; }
}
