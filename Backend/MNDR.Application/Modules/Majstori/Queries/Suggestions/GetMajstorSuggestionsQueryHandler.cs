namespace MNDR.Application.Modules.Majstori.Queries.Suggestions;

public class GetMajstorSuggestionsQueryHandler(IAppDbContext context)
    : IRequestHandler<GetMajstorSuggestionsQuery, List<MajstorSuggestionDto>>
{
    public async Task<List<MajstorSuggestionDto>> Handle(
        GetMajstorSuggestionsQuery request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.SearchTerm))
            return new List<MajstorSuggestionDto>();

        var searchTerm = request.SearchTerm.Trim();

        var suggestions = await context.Majstori
            .Include(m => m.Korisnik)
            .Where(m => m.Korisnik != null &&
                       (m.Korisnik!.Ime.Contains(searchTerm) ||
                        m.Korisnik.Prezime.Contains(searchTerm)))
            .OrderByDescending(m => m.ProsjecnaOcjena)
            .ThenBy(m => m.Korisnik!.Ime)
            .Take(request.MaxResults)
            .Select(m => new MajstorSuggestionDto
            {
                KorisnikId = m.KorisnikId,
                Ime = m.Korisnik!.Ime,
                Prezime = m.Korisnik.Prezime,
                Specijalizacija = m.Specijalizacija,
                SlikaProfila = m.Korisnik.SlikaProfila,
                ProsjecnaOcjena = m.ProsjecnaOcjena,
                Grad = m.Korisnik.Grad
            })
            .ToListAsync(cancellationToken);

        return suggestions;
    }
}
