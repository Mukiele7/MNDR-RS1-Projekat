namespace MNDR.Application.Modules.Ugovori.Commands.Create;

public sealed class CreateUgovorCommandDto
{
    public int UgovorId { get; set; }
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}
