namespace MNDR.Application.Modules.Razgovori.Commands.Create;

public sealed class CreateRazgovorCommandHandler : IRequestHandler<CreateRazgovorCommand, CreateRazgovorCommandDto>
{
    private readonly IAppDbContext _context;

    public CreateRazgovorCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<CreateRazgovorCommandDto> Handle(CreateRazgovorCommand request, CancellationToken cancellationToken)
    {
        var kupacExists = await _context.Kupci.AnyAsync(k => k.KorisnikId == request.KupacId, cancellationToken);
        var majstorExists = await _context.Majstori.AnyAsync(m => m.KorisnikId == request.MajstorId, cancellationToken);
        var oglasExists = await _context.Oglasi.AnyAsync(o => o.OglasId == request.OglasId, cancellationToken);

        if (!kupacExists || !majstorExists || !oglasExists)
            return new CreateRazgovorCommandDto { Success = false, Message = "Neispravni podaci" };

        // Provjeri da li razgovor već postoji za isti oglas između istih korisnika
        var existingRazgovor = await _context.Razgovori
            .FirstOrDefaultAsync(r => r.KupacId == request.KupacId 
                && r.MajstorId == request.MajstorId 
                && r.OglasId == request.OglasId, 
                cancellationToken);

        if (existingRazgovor != null)
        {
            return new CreateRazgovorCommandDto
            {
                RazgovorId = existingRazgovor.RazgovorId,
                Success = true,
                Message = "Razgovor već postoji"
            };
        }

        var razgovor = new Razgovor
        {
            KupacId = request.KupacId,
            MajstorId = request.MajstorId,
            OglasId = request.OglasId,
            DatumKreiranja = DateTime.UtcNow,
            DatumUpdate = DateTime.UtcNow
        };

        _context.Razgovori.Add(razgovor);
        await _context.SaveChangesAsync(cancellationToken);

        return new CreateRazgovorCommandDto
        {
            RazgovorId = razgovor.RazgovorId,
            Success = true,
            Message = "Razgovor je uspešno kreiran"
        };
    }
}
