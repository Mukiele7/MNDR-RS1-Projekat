namespace MNDR.Application.Modules.Kupci.Commands.Update;

public sealed class UpdateKupacCommandValidator : AbstractValidator<UpdateKupacCommand>
{
    public UpdateKupacCommandValidator()
    {
        RuleFor(x => x.KorisnikId)
            .GreaterThan(0).WithMessage("Neispravan ID korisnika");

        RuleFor(x => x.Ime)
            .NotEmpty().WithMessage("Ime je obavezno")
            .MaximumLength(50).WithMessage("Ime ne može biti duže od 50 karaktera");

        RuleFor(x => x.Prezime)
            .NotEmpty().WithMessage("Prezime je obavezno")
            .MaximumLength(50).WithMessage("Prezime ne može biti duže od 50 karaktera");

        RuleFor(x => x.Grad)
            .MaximumLength(100).WithMessage("Grad ne može biti duži od 100 karaktera")
            .When(x => !string.IsNullOrEmpty(x.Grad));

        RuleFor(x => x.Opcina)
            .MaximumLength(100).WithMessage("Općina ne može biti duža od 100 karaktera")
            .When(x => !string.IsNullOrEmpty(x.Opcina));

        RuleFor(x => x.Adresa)
            .MaximumLength(200).WithMessage("Adresa ne može biti duža od 200 karaktera")
            .When(x => !string.IsNullOrEmpty(x.Adresa));
    }
}
