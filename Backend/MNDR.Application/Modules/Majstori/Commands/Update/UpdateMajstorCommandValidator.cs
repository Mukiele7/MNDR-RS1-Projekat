namespace MNDR.Application.Modules.Majstori.Commands.Update;

public sealed class UpdateMajstorCommandValidator : AbstractValidator<UpdateMajstorCommand>
{
    public UpdateMajstorCommandValidator()
    {
        RuleFor(x => x.KorisnikId)
            .GreaterThan(0).WithMessage("Neispravan ID korisnika");

        RuleFor(x => x.Ime)
            .NotEmpty().WithMessage("Ime je obavezno")
            .MaximumLength(50).WithMessage("Ime ne može biti duže od 50 karaktera");

        RuleFor(x => x.Prezime)
            .NotEmpty().WithMessage("Prezime je obavezno")
            .MaximumLength(50).WithMessage("Prezime ne može biti duže od 50 karaktera");

        RuleFor(x => x.Specijalizacija)
            .NotEmpty().WithMessage("Specijalizacija je obavezna")
            .MaximumLength(100).WithMessage("Specijalizacija ne može biti duža od 100 karaktera");

        RuleFor(x => x.GodineIskustva)
            .GreaterThanOrEqualTo(0).WithMessage("Godine iskustva ne mogu biti negativne")
            .LessThanOrEqualTo(50).WithMessage("Godine iskustva ne mogu biti veće od 50");

        RuleFor(x => x.CijenaMjesecne)
            .GreaterThanOrEqualTo(0).WithMessage("Mjesečna cijena ne može biti negativna")
            .LessThanOrEqualTo(100000).WithMessage("Cijena ne može biti veća od 100,000 KM");

        RuleFor(x => x.CijenaSat)
            .GreaterThanOrEqualTo(0).WithMessage("Cijena po satu ne može biti negativna")
            .LessThanOrEqualTo(1000).WithMessage("Cijena po satu ne može biti veća od 1,000 KM");
        
        // Barem jedna cijena mora biti veća od 0
        RuleFor(x => x)
            .Must(x => x.CijenaSat > 0 || x.CijenaMjesecne > 0)
            .WithMessage("Morate uneti ili cijenu po satu ili mjesečnu cijenu");

        RuleFor(x => x.Grad)
            .MaximumLength(100).WithMessage("Grad ne može biti duži od 100 karaktera")
            .When(x => !string.IsNullOrEmpty(x.Grad));

        RuleFor(x => x.Opcina)
            .MaximumLength(100).WithMessage("Općina ne može biti duža od 100 karaktera")
            .When(x => !string.IsNullOrEmpty(x.Opcina));

        RuleFor(x => x.DetaljanOpisProfila)
            .MaximumLength(500).WithMessage("Detaljan opis ne može biti duži od 500 karaktera")
            .When(x => !string.IsNullOrEmpty(x.DetaljanOpisProfila));

        RuleFor(x => x.OpisProfila)
            .MaximumLength(300).WithMessage("Opis profila ne može biti duži od 300 karaktera")
            .When(x => !string.IsNullOrEmpty(x.OpisProfila));
    }
}
