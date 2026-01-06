namespace MNDR.Application.Modules.Razgovori.Commands.SendPoruka;

public sealed class SendRazgovorPorukaCommandDto
{
    public int RazgovorPorukaId { get; set; }
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}
