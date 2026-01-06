namespace MNDR.Application.Modules.Ugovori.Commands.Complete;

public sealed class CompleteUgovorCommand : IRequest<CompleteUgovorCommandDto>
{
    public required int UgovorId { get; set; }
}
