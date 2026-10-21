namespace MNDR.Application.Modules.Recenzije.Commands.Create;

public sealed class CreateRecenzijaCommandHandler : IRequestHandler<CreateRecenzijaCommand, CreateRecenzijaCommandDto>
{
    private readonly IAppDbContext _context;
    private readonly IAppCurrentUser _currentUser;

    public CreateRecenzijaCommandHandler(IAppDbContext context, IAppCurrentUser currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<CreateRecenzijaCommandDto> Handle(CreateRecenzijaCommand request, CancellationToken cancellationToken)
    {
        var ugovor = await _context.Ugovori
            .Include(u => u.Oglas)
            .FirstOrDefaultAsync(u => u.UgovorId == request.UgovorId, cancellationToken);
        if (ugovor == null)
            return new CreateRecenzijaCommandDto { Success = false, Message = "Ugovor nije pronađen" };
        if (ugovor.Status != "Završen" || _currentUser.UserId != ugovor.KupacId)
            return new CreateRecenzijaCommandDto { Success = false, Message = "Samo kupac završenog ugovora može ostaviti recenziju." };
        if (request.OcenaId < 1 || request.OcenaId > 5)
            return new CreateRecenzijaCommandDto { Success = false, Message = "Ocjena mora biti između 1 i 5." };
        if (await _context.Recenzije.AnyAsync(r => r.UgovorId == request.UgovorId, cancellationToken))
            return new CreateRecenzijaCommandDto { Success = false, Message = "Za ovaj ugovor već postoji recenzija." };

        var recenzija = new Recenzija
        {
            UgovorId = request.UgovorId,
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
