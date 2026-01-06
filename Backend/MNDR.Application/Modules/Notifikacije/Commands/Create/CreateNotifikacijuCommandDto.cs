namespace MNDR.Application.Modules.Notifikacije.Commands.Create;

public sealed class CreateNotifikacijuCommandDto
{
    public int NotifikacijaId { get; set; }
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}
