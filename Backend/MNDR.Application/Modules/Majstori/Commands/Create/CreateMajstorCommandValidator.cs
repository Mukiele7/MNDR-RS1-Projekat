namespace MNDR.Application.Modules.Majstori.Commands.Create;

public sealed class CreateMajstorCommandValidator : AbstractValidator<CreateMajstorCommand>
{
    public CreateMajstorCommandValidator()
    {
        RuleFor(x => x.Ime).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Prezime).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Telefon).NotEmpty().MaximumLength(30);
        RuleFor(x => x.Lozinka).NotEmpty().MinimumLength(6);
        RuleFor(x => x.Specijalizacija).NotEmpty().MaximumLength(100);
        RuleFor(x => x.GodineIskustva).InclusiveBetween(0, 50);
        RuleFor(x => x.CijenaMjesecne).InclusiveBetween(0, 100000);
        RuleFor(x => x.DetaljanOpisProfila).MaximumLength(500)
            .When(x => x.DetaljanOpisProfila is not null);
    }
}
