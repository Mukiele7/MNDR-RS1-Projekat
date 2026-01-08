namespace MNDR.Application.Modules.Majstori.Queries.Suggestions;

public class GetMajstorSuggestionsQuery : IRequest<List<MajstorSuggestionDto>>
{
    public string SearchTerm { get; set; } = string.Empty;
    public int MaxResults { get; set; } = 5;
}

public class MajstorSuggestionDto
{
    public int KorisnikId { get; set; }
    public string Ime { get; set; } = string.Empty;
    public string Prezime { get; set; } = string.Empty;
    public string Specijalizacija { get; set; } = string.Empty;
    public string? SlikaProfila { get; set; }
    public decimal? ProsjecnaOcjena { get; set; }
    public string? Grad { get; set; }
}
