namespace MNDR.Application.Modules.Oglasi.Commands.Create;

public sealed class CreateOglasCommandDto
{
    public int OglasId { get; set; }
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}
