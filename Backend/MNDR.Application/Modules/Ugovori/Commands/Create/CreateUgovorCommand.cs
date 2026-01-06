namespace MNDR.Application.Modules.Ugovori.Commands.Create;

public sealed class CreateUgovorCommand : IRequest<CreateUgovorCommandDto>
{
    public required int KupacId { get; set; }
    public required int OglasId { get; set; }
    public required DateTime DatumOd { get; set; }
    public required DateTime DatumDo { get; set; }
    public required decimal Cena { get; set; }
    public required string Opis { get; set; }
}
