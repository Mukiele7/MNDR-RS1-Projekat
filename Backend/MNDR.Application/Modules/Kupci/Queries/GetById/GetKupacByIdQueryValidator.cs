namespace MNDR.Application.Modules.Kupci.Queries.GetById;

public sealed class GetKupacByIdQueryValidator : AbstractValidator<GetKupacByIdQuery>
{
    public GetKupacByIdQueryValidator()
    {
        RuleFor(x => x.KorisnikId)
            .GreaterThan(0).WithMessage("Neispravan ID korisnika");
    }
}
