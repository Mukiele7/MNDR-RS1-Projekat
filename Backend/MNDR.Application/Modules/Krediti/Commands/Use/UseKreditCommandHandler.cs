namespace MNDR.Application.Modules.Krediti.Commands.Use;

public sealed class UseKreditCommandHandler : IRequestHandler<UseKreditCommand, UseKreditCommandDto>
{
    private readonly IAppDbContext _context;

    public UseKreditCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<UseKreditCommandDto> Handle(UseKreditCommand request, CancellationToken cancellationToken)
    {
        var korisnikExists = await _context.Korisnici.AnyAsync(k => k.KorisnikId == request.KorisnikId, cancellationToken);
        if (!korisnikExists)
            return new UseKreditCommandDto { Success = false, Message = "Korisnik nije pronađen" };

        var kredit = new Kredit
        {
            MajstorId = request.KorisnikId,
            Iznos = request.Kolicina,
            NacinPlacanja = request.Tip,
            DatumTransakcija = DateTime.UtcNow,
            StatusTransakcije = "Završena"
        };

        _context.Krediti.Add(kredit);
        await _context.SaveChangesAsync(cancellationToken);

        return new UseKreditCommandDto
        {
            KreditId = kredit.TransakcijaKreditaId,
            Success = true,
            Message = "Krediti su uspješno potrošeni"
        };
    }
}
