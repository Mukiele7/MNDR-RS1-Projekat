namespace MNDR.Application.Modules.Oglasi.Queries.GetAll;

public sealed class GetOglasQuery : IRequest<PagedOglasResult>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    
    // Filter 1: Status
    public string? Status { get; set; }
    
    // Filter 2: MajstorId
    public int? MajstorId { get; set; }
    
    // Filter 3: KategorijaId
    public int? KategorijaId { get; set; }
    
    // Filter 4: SearchTerm (pretraga po naslovu i opisu)
    public string? SearchTerm { get; set; }
    
    // Filter 5: DatumOd (oglasi objavljeni od ovog datuma)
    public DateTime? DatumOd { get; set; }
    
    // Filter 6: DatumDo (oglasi objavljeni do ovog datuma)
    public DateTime? DatumDo { get; set; }
    
    // Filter 7: Grad (grad majstora)
    public string? Grad { get; set; }
}
