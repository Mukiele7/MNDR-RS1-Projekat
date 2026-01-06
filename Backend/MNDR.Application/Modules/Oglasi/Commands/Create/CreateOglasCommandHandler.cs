namespace MNDR.Application.Modules.Oglasi.Commands.Create;

public sealed class CreateOglasCommandHandler : IRequestHandler<CreateOglasCommand, CreateOglasCommandDto>
{
    private readonly IAppDbContext _context;

    public CreateOglasCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<CreateOglasCommandDto> Handle(CreateOglasCommand request, CancellationToken cancellationToken)
    {
        var majstorExists = await _context.Majstori.AnyAsync(m => m.KorisnikId == request.MajstorId, cancellationToken);
        if (!majstorExists)
            return new CreateOglasCommandDto { Success = false, Message = "Majstor nije pronađen" };

        var oglas = new Oglas
        {
            MajstorId = request.MajstorId,
            Naslov = request.Naslov,
            Opis = request.Opis,
            DatumObjave = DateTime.UtcNow,
            Status = "Aktivan"
        };

        _context.Oglasi.Add(oglas);
        await _context.SaveChangesAsync(cancellationToken);

        // Add categories
        foreach (var kategorijaId in request.KategorijeIds)
        {
            var oK = new OglasKategorija
            {
                OglasId = oglas.OglasId,
                KategorijaId = kategorijaId
            };
            _context.OglasKategorije.Add(oK);
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new CreateOglasCommandDto
        {
            OglasId = oglas.OglasId,
            Success = true,
            Message = "Oglas je uspješno objavljen"
        };
    }
}
