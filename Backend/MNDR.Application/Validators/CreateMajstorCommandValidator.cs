using FluentValidation;
using MNDR.Application.Commands;

namespace MNDR.Application.Validators
{
    public class CreateMajstorCommandValidator : AbstractValidator<CreateMajstorCommand>
    {
        public CreateMajstorCommandValidator()
        {
            RuleFor(x => x.Specijalizacija)
                .NotEmpty().WithMessage("Specijalizacija je obavezna")
                .MaximumLength(100).WithMessage("Specijalizacija ne može biti duža od 100 karaktera");

            RuleFor(x => x.GodineIskustva)
                .GreaterThanOrEqualTo(0).WithMessage("Godine iskustva ne mogu biti negativne")
                .LessThanOrEqualTo(50).WithMessage("Godine iskustva ne mogu biti veće od 50");

            RuleFor(x => x.CijenaMjesecne)
                .GreaterThan(0).WithMessage("Cijena mora biti veća od 0")
                .LessThanOrEqualTo(100000).WithMessage("Cijena ne može biti veća od 100,000 KM");

            RuleFor(x => x.DetaljanOpisProfila)
                .MaximumLength(500).WithMessage("Opis ne može biti duži od 500 karaktera");
        }
    }
}
