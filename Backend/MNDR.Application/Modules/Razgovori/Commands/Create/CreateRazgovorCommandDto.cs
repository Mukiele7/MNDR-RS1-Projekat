namespace MNDR.Application.Modules.Razgovori.Commands.Create;

public sealed class CreateRazgovorCommandDto
{
    public int RazgovorId { get; set; }
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}
