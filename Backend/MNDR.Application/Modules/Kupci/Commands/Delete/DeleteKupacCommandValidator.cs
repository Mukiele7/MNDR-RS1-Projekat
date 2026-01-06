namespace MNDR.Application.Modules.Kupci.Commands.Delete;

public sealed class DeleteKupacCommandValidator : AbstractValidator<DeleteKupacCommand>
{
    public DeleteKupacCommandValidator()
    {
        RuleFor(x => x.KorisnikId)
            .GreaterThan(0).WithMessage("Neispravan ID korisnika");
    }
}
