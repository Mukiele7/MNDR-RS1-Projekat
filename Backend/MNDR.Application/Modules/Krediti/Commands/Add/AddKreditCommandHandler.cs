namespace MNDR.Application.Modules.Krediti.Commands.Add;

public sealed class AddKreditCommandHandler : IRequestHandler<AddKreditCommand, AddKreditCommandDto>
{
    private readonly IAppDbContext _context;

    public AddKreditCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<AddKreditCommandDto> Handle(AddKreditCommand request, CancellationToken cancellationToken)
    {
        var majstorExists = await _context.Majstori.AnyAsync(m => m.KorisnikId == request.MajstorId, cancellationToken);
        if (!majstorExists)
            return new AddKreditCommandDto { Success = false, Message = "Majstor nije pronađen" };

        var kredit = new Kredit
        {
            MajstorId = request.MajstorId,
            BrojKupljenihKredita = request.Iznos > 0 ? 1 : 0,
            Iznos = request.Iznos,
            DatumTransakcija = DateTime.UtcNow,
            NacinPlacanja = "Online",
            StatusTransakcije = "Završena"
        };

        _context.Krediti.Add(kredit);
        await _context.SaveChangesAsync(cancellationToken);

        return new AddKreditCommandDto
        {
            KreditId = kredit.TransakcijaKreditaId,
            Success = true,
            Message = "Krediti su uspešno dodani"
        };
    }
}
