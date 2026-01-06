namespace MNDR.Application.Modules.Krediti.Commands.Add;

public sealed class AddKreditCommandDto
{
    public int KreditId { get; set; }
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}
