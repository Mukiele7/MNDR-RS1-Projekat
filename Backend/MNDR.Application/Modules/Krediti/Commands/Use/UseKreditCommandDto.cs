namespace MNDR.Application.Modules.Krediti.Commands.Use;

public sealed class UseKreditCommandDto
{
    public int KreditId { get; set; }
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}
