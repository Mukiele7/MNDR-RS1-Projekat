namespace MNDR.Application.Modules.Recenzije.Commands.Create;

public sealed class CreateRecenzijaCommandHandler : IRequestHandler<CreateRecenzijaCommand, CreateRecenzijaCommandDto>
{
    private readonly IAppDbContext _context;

    public CreateRecenzijaCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<CreateRecenzijaCommandDto> Handle(CreateRecenzijaCommand request, CancellationToken cancellationToken)
    {
        var ugovor = await _context.Ugovori.Include(u => u.Oglas).FirstOrDefaultAsync(u => u.UgovorId == request.UgovorId, cancellationToken);
        if (ugovor == null)
            return new CreateRecenzijaCommandDto { Success = false, Message = "Ugovor nije pronađen" };

        var recenzija = new Recenzija
        {
            UgovorId = request.UgovorId,
            MajstorId = ugovor.Oglas!.MajstorId,
            KupacId = ugovor.KupacId,
            Ocjena = request.OcenaId,
            Komentar = request.Komentar,
            DatumRecenzije = DateTime.UtcNow
        };

        _context.Recenzije.Add(recenzija);
        await _context.SaveChangesAsync(cancellationToken);

        return new CreateRecenzijaCommandDto
        {
            RecenzijaId = recenzija.RecenzijaId,
            Success = true,
            Message = "Recenzija je uspješno dodana"
        };
    }
}
