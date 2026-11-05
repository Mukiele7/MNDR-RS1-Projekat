namespace MNDR.Application.Modules.Razgovori.Commands.SendPoruka;

public sealed class SendRazgovorPorukaCommandValidator : AbstractValidator<SendRazgovorPorukaCommand>
{
    public SendRazgovorPorukaCommandValidator()
    {
        RuleFor(x => x.RazgovorId).GreaterThan(0);
        RuleFor(x => x.Sadrzaj).NotEmpty().MaximumLength(4000);
    }
}
