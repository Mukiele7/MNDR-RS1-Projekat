namespace MNDR.Application.Modules.Razgovori.Queries.GetById;

public sealed class GetRazgovorQueryHandler : IRequestHandler<GetRazgovorQuery, RazgovorDetailDto>
{
    private readonly IAppDbContext _context;

    public GetRazgovorQueryHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<RazgovorDetailDto> Handle(GetRazgovorQuery request, CancellationToken cancellationToken)
    {
        var razgovor = await _context.Razgovori
            .Include(r => r.Kupac)
            .ThenInclude(k => k!.Korisnik)
            .Include(r => r.Majstor)
            .ThenInclude(m => m!.Korisnik)
            .Include(r => r.Poruke)
            .ThenInclude(p => p.Posiljaoc)
            .FirstOrDefaultAsync(r => r.RazgovorId == request.RazgovorId, cancellationToken);

        if (razgovor == null)
            throw new KeyNotFoundException($"Razgovor sa ID {request.RazgovorId} nije pronađen");

        return new RazgovorDetailDto
        {
            RazgovorId = razgovor.RazgovorId,
            KupacId = razgovor.KupacId,
            MajstorId = razgovor.MajstorId,
            OglasId = razgovor.OglasId,
            KupacIme = razgovor.Kupac!.Korisnik!.Ime + " " + razgovor.Kupac.Korisnik.Prezime,
            MajstorIme = razgovor.Majstor!.Korisnik!.Ime + " " + razgovor.Majstor.Korisnik.Prezime,
            DatumKreiranja = razgovor.DatumKreiranja,
            DatumUpdate = razgovor.DatumUpdate,
            Poruke = razgovor.Poruke.Select(p => new RazgovorPorukaDetailDto
            {
                RazgovorPorukaId = p.RazgovorPorukaId,
                PosiljaocId = p.PosiljaocId,
                Sadrzaj = p.Sadrzaj,
                VrijemeSlanja = p.VrijemeSlanja,
                PosiljaocIme = p.Posiljaoc!.Ime + " " + p.Posiljaoc.Prezime
            }).ToList()
        };
    }
}
