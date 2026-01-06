namespace MNDR.Application.Modules.Notifikacije.Commands.Create;

public sealed class CreateNotifikacijuCommand : IRequest<CreateNotifikacijuCommandDto>
{
    public required int KorisnikId { get; set; }
    public required string Naslov { get; set; }
    public required string Poruka { get; set; }
    public required string Tip { get; set; }
}
