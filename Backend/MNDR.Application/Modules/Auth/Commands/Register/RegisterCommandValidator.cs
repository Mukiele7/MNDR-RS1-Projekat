namespace MNDR.Application.Modules.Auth.Commands.Register;

/// <summary>
/// Validator za RegisterCommand.
/// </summary>
public sealed class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("Ime je obavezno")
            .MinimumLength(2).WithMessage("Ime mora biti najmanje 2 karaktera");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Prezime je obavezno")
            .MinimumLength(2).WithMessage("Prezime mora biti najmanje 2 karaktera");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email je obavezan")
            .EmailAddress().WithMessage("Email nije ispravan")
            .Matches(@"^[^@\s]+@[^@\s]+\.com$")
            .WithMessage("Email mora biti u formatu: primer@domen.com");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Lozinka je obavezna")
            .MinimumLength(6).WithMessage("Lozinka mora biti najmanje 6 karaktera")
            .Matches(@"[A-Z]").WithMessage("Lozinka mora sadržati velika slova")
            .Matches(@"[a-z]").WithMessage("Lozinka mora sadržati mala slova")
            .Matches(@"[0-9]").WithMessage("Lozinka mora sadržati brojeve");

        RuleFor(x => x.ConfirmPassword)
            .Equal(x => x.Password).WithMessage("Lozinke se ne poklapaju");

        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("Telefon je obavezan")
            .Must(BeValidPhoneNumber)
            .WithMessage("Unesite broj: 061234567 ili +38761234567");

        RuleFor(x => x.Role)
            .InclusiveBetween(0, 2).WithMessage("Role mora biti 0 (Kupac), 1 (Majstor) ili 2 (Administrator)");
    }

    private bool BeValidPhoneNumber(string phone)
    {
        if (string.IsNullOrWhiteSpace(phone)) return false;
        
        // Ukloni sve razmake, crtice i zagrade
        var cleaned = phone.Replace(" ", "").Replace("-", "").Replace("(", "").Replace(")", "");
        
        // Format 1: +38761234567 (12 cifara)
        if (cleaned.StartsWith("+387") && cleaned.Length == 12)
            return char.IsDigit(cleaned[4]) && (cleaned[4] >= '6' && cleaned[4] <= '9');
        
        // Format 2: 061234567 (9 cifara)
        if (cleaned.StartsWith("0") && cleaned.Length == 9)
            return cleaned[1] >= '6' && cleaned[1] <= '9';
        
        // Format 3: 61234567 (8 cifara)
        if (cleaned.Length == 8)
            return cleaned[0] >= '6' && cleaned[0] <= '9';
        
        return false;
    }
}
