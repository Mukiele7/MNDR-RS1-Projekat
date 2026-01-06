namespace MNDR.Application.Modules.Razgovori.Commands.Create;

public sealed class CreateRazgovorCommand : IRequest<CreateRazgovorCommandDto>
{
    public required int KupacId { get; set; }
    public required int MajstorId { get; set; }
    public required int OglasId { get; set; }
}
