namespace MNDR.Application.Modules.Recenzije.Commands.Create;

public sealed class CreateRecenzijaCommand : IRequest<CreateRecenzijaCommandDto>
{
    public required int UgovorId { get; set; }
    public required int OcenaId { get; set; }
    public required string Komentar { get; set; }
}
