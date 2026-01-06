namespace MNDR.Application.Modules.Razgovori.Commands.SendPoruka;

public sealed class SendRazgovorPorukaCommandHandler : IRequestHandler<SendRazgovorPorukaCommand, SendRazgovorPorukaCommandDto>
{
    private readonly IAppDbContext _context;

    public SendRazgovorPorukaCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<SendRazgovorPorukaCommandDto> Handle(SendRazgovorPorukaCommand request, CancellationToken cancellationToken)
    {
        var razgovesExists = await _context.Razgovori.AnyAsync(r => r.RazgovorId == request.RazgovorId, cancellationToken);
        var posiljaocExists = await _context.Korisnici.AnyAsync(k => k.KorisnikId == request.PosiljaocId, cancellationToken);

        if (!razgovesExists || !posiljaocExists)
            return new SendRazgovorPorukaCommandDto { Success = false, Message = "Nevaljani podaci" };

        var poruka = new RazgovorPoruka
        {
            RazgovorId = request.RazgovorId,
            PosiljaocId = request.PosiljaocId,
            Sadrzaj = request.Sadrzaj,
            Status = "Poslana",
            VrijemeSlanja = DateTime.UtcNow
        };

        _context.RazgovorPoruke.Add(poruka);

        var razgovor = await _context.Razgovori.FirstAsync(r => r.RazgovorId == request.RazgovorId, cancellationToken);
        razgovor.DatumUpdate = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return new SendRazgovorPorukaCommandDto
        {
            RazgovorPorukaId = poruka.RazgovorPorukaId,
            Success = true,
            Message = "Poruka je uspješno poslana"
        };
    }
}
