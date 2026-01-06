namespace MNDR.Application.Modules.Majstori.Queries.List;

public class ListMajstoriQuery : IRequest<PagedMajstoriResult>
{
    // Filter 1: Specijalizacija
    public string? Specijalizacija { get; set; }
    // Filter 2: Grad
    public string? Grad { get; set; }
    // Filter 3: Općina
    public string? Opcina { get; set; }
    // Filter 4: Search term (ime ili prezime)
    public string? SearchTerm { get; set; }
    // Filter 5: Minimalne godine iskustva
    public int? MinGodineIskustva { get; set; }
    // Filter 6: Maksimalna cijena mjesečne
    public decimal? MaxCijenaMjesecne { get; set; }
    // Filter 7: Minimalna prosječna ocjena
    public decimal? MinProsjecnaOcjena { get; set; }

    // Paging
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
