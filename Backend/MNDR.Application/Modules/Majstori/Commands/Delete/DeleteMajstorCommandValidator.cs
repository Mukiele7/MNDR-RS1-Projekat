namespace MNDR.Application.Modules.Majstori.Commands.Delete;

public sealed class DeleteMajstorCommandValidator : AbstractValidator<DeleteMajstorCommand>
{
    public DeleteMajstorCommandValidator()
    {
        RuleFor(x => x.KorisnikId)
            .GreaterThan(0).WithMessage("Neispravan ID korisnika");
    }
}
