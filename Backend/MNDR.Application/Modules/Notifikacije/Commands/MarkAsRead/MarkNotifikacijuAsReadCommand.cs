namespace MNDR.Application.Modules.Notifikacije.Commands.MarkAsRead;

public sealed class MarkNotifikacijuAsReadCommand : IRequest<MarkNotifikacijuAsReadCommandDto>
{
    public required int NotifikacijaId { get; set; }
}
