namespace MNDR.Application.Modules.Recenzije.Commands.Create;

public sealed class CreateRecenzijaCommandValidator : AbstractValidator<CreateRecenzijaCommand>
{
    public CreateRecenzijaCommandValidator()
    {
        RuleFor(x => x.UgovorId).GreaterThan(0);
        RuleFor(x => x.OcenaId).InclusiveBetween(1, 5);
        RuleFor(x => x.Komentar).NotEmpty().MaximumLength(2000);
    }
}
