namespace MNDR.Application.Modules.Razgovori.Commands.SendPoruka;

public sealed class SendRazgovorPorukaCommandHandler : IRequestHandler<SendRazgovorPorukaCommand, SendRazgovorPorukaCommandDto>
{
    private readonly IAppDbContext _context;
    private readonly IAppCurrentUser _currentUser;

    public SendRazgovorPorukaCommandHandler(IAppDbContext context, IAppCurrentUser currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<SendRazgovorPorukaCommandDto> Handle(SendRazgovorPorukaCommand request, CancellationToken cancellationToken)
    {
        var razgovor = await _context.Razgovori.FirstOrDefaultAsync(r => r.RazgovorId == request.RazgovorId, cancellationToken);
        var senderId = _currentUser.UserId;

        if (razgovor is null || !senderId.HasValue ||
            (razgovor.KupacId != senderId.Value && razgovor.MajstorId != senderId.Value))
            return new SendRazgovorPorukaCommandDto { Success = false, Message = "Nevaljani podaci" };

        var poruka = new RazgovorPoruka
        {
            RazgovorId = request.RazgovorId,
            PosiljaocId = senderId.Value,
            Sadrzaj = request.Sadrzaj,
            Status = "Poslana",
            VrijemeSlanja = DateTime.UtcNow
        };

        _context.RazgovorPoruke.Add(poruka);

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
