namespace MNDR.Application.Modules.Ugovori.Commands.Complete;

public sealed class CompleteUgovorCommandDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}
