namespace MNDR.Application.Modules.Oglasi.Commands.Create;

public sealed class CreateOglasCommand : IRequest<CreateOglasCommandDto>
{
    public required int MajstorId { get; set; }
    public required string Naslov { get; set; }
    public required string Opis { get; set; }
    public required List<int> KategorijeIds { get; set; }
}
