namespace MNDR.Application.Modules.Ugovori.Commands.Create;

public sealed class CreateUgovorCommandHandler : IRequestHandler<CreateUgovorCommand, CreateUgovorCommandDto>
{
    private readonly IAppDbContext _context;
    private readonly IAppCurrentUser _currentUser;

    public CreateUgovorCommandHandler(IAppDbContext context, IAppCurrentUser currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<CreateUgovorCommandDto> Handle(CreateUgovorCommand request, CancellationToken cancellationToken)
    {
        var kupacExists = await _context.Kupci.AnyAsync(k => k.KorisnikId == request.KupacId, cancellationToken);
        var oglas = await _context.Oglasi.FirstOrDefaultAsync(o => o.OglasId == request.OglasId, cancellationToken);

        if (!kupacExists || oglas is null || !string.Equals(oglas.Status, "Aktivan", StringComparison.OrdinalIgnoreCase))
            return new CreateUgovorCommandDto { Success = false, Message = "Neispravni podaci" };
        if (_currentUser.UserId != request.KupacId || request.DatumDo <= request.DatumOd || request.Cena < 0)
            return new CreateUgovorCommandDto { Success = false, Message = "Neispravni podaci ugovora." };

        var ugovor = new Ugovor
        {
            KupacId = request.KupacId,
            OglasId = request.OglasId,
            MajstorId = oglas.MajstorId,
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
