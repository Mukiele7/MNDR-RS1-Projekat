namespace MNDR.Application.Modules.Recenzije.Commands.Create;

public sealed class CreateRecenzijaCommandDto
{
    public int RecenzijaId { get; set; }
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}
