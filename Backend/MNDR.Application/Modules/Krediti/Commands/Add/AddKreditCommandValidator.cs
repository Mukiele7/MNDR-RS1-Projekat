namespace MNDR.Application.Modules.Krediti.Commands.Add;

public sealed class AddKreditCommandValidator : AbstractValidator<AddKreditCommand>
{
    public AddKreditCommandValidator()
    {
        RuleFor(x => x.MajstorId).GreaterThan(0);
        RuleFor(x => x.Iznos).GreaterThan(0);
    }
}
