namespace MNDR.Application.Modules.Notifikacije.Commands.MarkAsRead;

public sealed class MarkNotifikacijuAsReadCommandDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}
