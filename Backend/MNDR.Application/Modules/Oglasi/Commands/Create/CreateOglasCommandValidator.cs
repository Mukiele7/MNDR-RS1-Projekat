namespace MNDR.Application.Modules.Oglasi.Commands.Create;

public sealed class CreateOglasCommandValidator : AbstractValidator<CreateOglasCommand>
{
    public CreateOglasCommandValidator()
    {
        RuleFor(x => x.Naslov)
            .NotEmpty().WithMessage("Naslov je obavezan")
            .MinimumLength(5).WithMessage("Naslov mora biti najmanje 5 karaktera")
            .MaximumLength(200).WithMessage("Naslov ne sme biti duži od 200 karaktera");

        RuleFor(x => x.Opis)
            .NotEmpty().WithMessage("Opis je obavezan")
            .MinimumLength(10).WithMessage("Opis mora biti najmanje 10 karaktera")
            .MaximumLength(1000).WithMessage("Opis ne sme biti duži od 1000 karaktera");

        RuleFor(x => x.MajstorId)
            .GreaterThan(0).WithMessage("Majstor ID je neispravan");

        RuleFor(x => x.KategorijeIds)
            .NotEmpty().WithMessage("Trebate odabrati najmanje jednu kategoriju");
    }
}
