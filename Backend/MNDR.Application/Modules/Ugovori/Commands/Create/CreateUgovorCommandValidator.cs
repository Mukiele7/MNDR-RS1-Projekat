namespace MNDR.Application.Modules.Ugovori.Commands.Create;

public sealed class CreateUgovorCommandValidator : AbstractValidator<CreateUgovorCommand>
{
    public CreateUgovorCommandValidator()
    {
        RuleFor(x => x.KupacId).GreaterThan(0);
        RuleFor(x => x.OglasId).GreaterThan(0);
        RuleFor(x => x.DatumOd).LessThan(x => x.DatumDo);
        RuleFor(x => x.Cena).GreaterThan(0);
        RuleFor(x => x.Opis).NotEmpty().MaximumLength(2000);
    }
}
