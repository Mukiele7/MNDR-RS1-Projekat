namespace MNDR.Application.Modules.Kupci.Commands.Create;

public sealed class CreateKupacCommandValidator : AbstractValidator<CreateKupacCommand>
{
    public CreateKupacCommandValidator()
    {
        RuleFor(x => x.Ime)
            .NotEmpty().WithMessage("Ime je obavezno")
            .MaximumLength(50).WithMessage("Ime ne može biti duže od 50 karaktera");

        RuleFor(x => x.Prezime)
            .NotEmpty().WithMessage("Prezime je obavezno")
            .MaximumLength(50).WithMessage("Prezime ne može biti duže od 50 karaktera");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email je obavezan")
            .EmailAddress().WithMessage("Email format nije ispravan")
            .Matches(@"^[^@\s]+@[^@\s]+\.com$").WithMessage("Email mora biti u formatu: primjer@domen.com");

        RuleFor(x => x.Telefon)
            .NotEmpty().WithMessage("Telefon je obavezan")
            .Must(BeValidPhoneNumber).WithMessage("Unesite broj: 061234567 ili +38761234567");

        RuleFor(x => x.Lozinka)
            .NotEmpty().WithMessage("Lozinka je obavezna")
            .MinimumLength(6).WithMessage("Lozinka mora imati najmanje 6 karaktera");

        RuleFor(x => x.KorisnickoIme)
            .MaximumLength(50).WithMessage("Korisničko ime ne može biti duže od 50 karaktera")
            .When(x => !string.IsNullOrEmpty(x.KorisnickoIme));

        RuleFor(x => x.Grad)
            .MaximumLength(100).WithMessage("Grad ne može biti duži od 100 karaktera")
            .When(x => !string.IsNullOrEmpty(x.Grad));

        RuleFor(x => x.Opcina)
            .MaximumLength(100).WithMessage("Općina ne može biti duža od 100 karaktera")
            .When(x => !string.IsNullOrEmpty(x.Opcina));

        RuleFor(x => x.OpisProfila)
            .MaximumLength(500).WithMessage("Opis profila ne može biti duži od 500 karaktera")
            .When(x => !string.IsNullOrEmpty(x.OpisProfila));
    }

    private static bool BeValidPhoneNumber(string telefon)
    {
        var cleaned = telefon.Replace(" ", "").Replace("-", "").Replace("(", "").Replace(")", "");
        
        if (cleaned.StartsWith("+387") && cleaned.Length == 12 && cleaned[4] >= '6' && cleaned[4] <= '9')
            return true;
        
        if (cleaned.StartsWith("0") && cleaned.Length == 9 && cleaned[1] >= '6' && cleaned[1] <= '9')
            return true;
        
        if (cleaned.Length == 8 && cleaned[0] >= '6' && cleaned[0] <= '9')
            return true;

        return false;
    }
}
