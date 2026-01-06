namespace MNDR.Application.Modules.Krediti.Commands.Use;

public sealed class UseKreditCommand : IRequest<UseKreditCommandDto>
{
    public required int KorisnikId { get; set; }
    public required decimal Kolicina { get; set; }
    public required string Tip { get; set; }
}
