namespace MNDR.Application.Modules.Majstori.Queries.GetById;

public sealed class GetMajstorByIdQueryValidator : AbstractValidator<GetMajstorByIdQuery>
{
    public GetMajstorByIdQueryValidator()
    {
        RuleFor(x => x.KorisnikId)
            .GreaterThan(0).WithMessage("Neispravan ID korisnika");
    }
}
