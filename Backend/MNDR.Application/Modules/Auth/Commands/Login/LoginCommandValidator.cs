namespace MNDR.Application.Modules.Auth.Commands.Login;

/// <summary>
/// Validator za LoginCommand.
/// Validira email i password polja.
/// </summary>
public sealed class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email je obavezan")
            .EmailAddress().WithMessage("Email nije ispravan");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Lozinka je obavezna")
            .MinimumLength(6).WithMessage("Lozinka mora biti najmanje 6 karaktera");
    }
}
