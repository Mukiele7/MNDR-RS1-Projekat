namespace MNDR.Application.Modules.Krediti.Commands.Add;

public sealed class AddKreditCommand : IRequest<AddKreditCommandDto>
{
    public required int MajstorId { get; set; }
    public required decimal Iznos { get; set; }
}
