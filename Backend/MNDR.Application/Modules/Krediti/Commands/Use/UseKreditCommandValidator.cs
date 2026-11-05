namespace MNDR.Application.Modules.Krediti.Commands.Use;

public sealed class UseKreditCommandValidator : AbstractValidator<UseKreditCommand>
{
    public UseKreditCommandValidator()
    {
        RuleFor(x => x.KorisnikId).GreaterThan(0);
        RuleFor(x => x.Kolicina).GreaterThan(0);
        RuleFor(x => x.Tip).NotEmpty().MaximumLength(100);
    }
}
