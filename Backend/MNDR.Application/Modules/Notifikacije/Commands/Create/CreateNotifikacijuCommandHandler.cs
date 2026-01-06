namespace MNDR.Application.Modules.Notifikacije.Commands.Create;

public sealed class CreateNotifikacijuCommandHandler : IRequestHandler<CreateNotifikacijuCommand, CreateNotifikacijuCommandDto>
{
    private readonly IAppDbContext _context;

    public CreateNotifikacijuCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<CreateNotifikacijuCommandDto> Handle(CreateNotifikacijuCommand request, CancellationToken cancellationToken)
    {
        var korisnikExists = await _context.Korisnici.AnyAsync(k => k.KorisnikId == request.KorisnikId, cancellationToken);
        if (!korisnikExists)
            return new CreateNotifikacijuCommandDto { Success = false, Message = "Korisnik nije pronađen" };

        var notifikacija = new Notifikacija
        {
            KorisnikId = request.KorisnikId,
            Sadrzaj = request.Naslov + ": " + request.Poruka,
            TipNotifikacije = request.Tip,
            DatumSlanja = DateTime.UtcNow,
            Procitano = false
        };

        _context.Notifikacije.Add(notifikacija);
        await _context.SaveChangesAsync(cancellationToken);

        return new CreateNotifikacijuCommandDto
        {
            NotifikacijaId = notifikacija.NotifikacijaId,
            Success = true,
            Message = "Notifikacija je uspešno poslana"
        };
    }
}
