using FluentValidation;
using MNDR.Application.Commands;

namespace MNDR.Application.Validators
{
    public class UpdateMajstorCommandValidator : AbstractValidator<UpdateMajstorCommand>
    {
        public UpdateMajstorCommandValidator()
        {
            RuleFor(x => x.KorisnikId)
                .GreaterThan(0).WithMessage("ID korisnika mora biti veći od 0");

            RuleFor(x => x.Ime)
                .NotEmpty().WithMessage("Ime je obavezno.")
                .MinimumLength(2).WithMessage("Ime mora imati najmanje 2 karaktera.")
                .MaximumLength(50).WithMessage("Ime ne smije biti duže od 50 karaktera.");

            RuleFor(x => x.Prezime)
                .NotEmpty().WithMessage("Prezime je obavezno.")
                .MinimumLength(2).WithMessage("Prezime mora imati najmanje 2 karaktera.")
                .MaximumLength(50).WithMessage("Prezime ne smije biti duže od 50 karaktera.");

            RuleFor(x => x.Grad)
                .NotEmpty().WithMessage("Grad je obavezan.");

            RuleFor(x => x.Specijalizacija)
                .NotEmpty().WithMessage("Specijalizacija je obavezna")
                .MaximumLength(100).WithMessage("Specijalizacija ne može biti duža od 100 karaktera");

            RuleFor(x => x.GodineIskustva)
                .GreaterThanOrEqualTo(0).WithMessage("Godine iskustva ne mogu biti negativne")
                .LessThanOrEqualTo(50).WithMessage("Godine iskustva ne mogu biti veće od 50");

            RuleFor(x => x.CijenaSat)
                .GreaterThan(0).WithMessage("Cijena po satu mora biti veća od 0")
                .LessThanOrEqualTo(500).WithMessage("Cijena po satu ne može biti veća od 500 KM");

            RuleFor(x => x.OpisProfila)
                .MaximumLength(1000).WithMessage("Opis ne može biti duži od 1000 karaktera")
                .MinimumLength(20).WithMessage("Opis profila mora imati najmanje 20 karaktera.")
                .When(x => !string.IsNullOrEmpty(x.OpisProfila));
        }
    }
}
