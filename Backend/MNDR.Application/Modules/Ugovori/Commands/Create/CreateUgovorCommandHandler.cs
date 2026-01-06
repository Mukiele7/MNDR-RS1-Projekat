namespace MNDR.Application.Modules.Ugovori.Commands.Create;

public sealed class CreateUgovorCommandHandler : IRequestHandler<CreateUgovorCommand, CreateUgovorCommandDto>
{
    private readonly IAppDbContext _context;

    public CreateUgovorCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<CreateUgovorCommandDto> Handle(CreateUgovorCommand request, CancellationToken cancellationToken)
    {
        var kupacExists = await _context.Kupci.AnyAsync(k => k.KorisnikId == request.KupacId, cancellationToken);
        var oglasExists = await _context.Oglasi.AnyAsync(o => o.OglasId == request.OglasId, cancellationToken);

        if (!kupacExists || !oglasExists)
            return new CreateUgovorCommandDto { Success = false, Message = "Neispravni podaci" };

        var ugovor = new Ugovor
        {
            KupacId = request.KupacId,
            OglasId = request.OglasId,
            DatumOd = request.DatumOd,
            DatumDo = request.DatumDo,
            Cena = request.Cena,
            Opis = request.Opis,
            Status = "Aktivan",
            DatumKreiranja = DateTime.UtcNow
        };

        _context.Ugovori.Add(ugovor);
        await _context.SaveChangesAsync(cancellationToken);

        return new CreateUgovorCommandDto
        {
            UgovorId = ugovor.UgovorId,
            Success = true,
            Message = "Ugovor je uspješno kreiran"
        };
    }
}
