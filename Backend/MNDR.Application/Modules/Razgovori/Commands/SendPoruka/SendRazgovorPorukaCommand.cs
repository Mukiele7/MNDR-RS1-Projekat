namespace MNDR.Application.Modules.Razgovori.Commands.SendPoruka;

public sealed class SendRazgovorPorukaCommand : IRequest<SendRazgovorPorukaCommandDto>
{
    public required int RazgovorId { get; set; }
    public required int PosiljaocId { get; set; }
    public required string Sadrzaj { get; set; }
}
