namespace MNDR.Application.Modules.Razgovori.Commands.Create;

public sealed class CreateRazgovorCommandValidator : AbstractValidator<CreateRazgovorCommand>
{
    public CreateRazgovorCommandValidator()
    {
        RuleFor(x => x.KupacId).GreaterThan(0);
        RuleFor(x => x.MajstorId).GreaterThan(0);
        RuleFor(x => x.OglasId).GreaterThan(0);
    }
}
