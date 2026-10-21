namespace MNDR.Application.Modules.Ugovori.Commands.Complete;

public sealed class CompleteUgovorCommandHandler : IRequestHandler<CompleteUgovorCommand, CompleteUgovorCommandDto>
{
    private readonly IAppDbContext _context;
    private readonly IAppCurrentUser _currentUser;

    public CompleteUgovorCommandHandler(IAppDbContext context, IAppCurrentUser currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<CompleteUgovorCommandDto> Handle(CompleteUgovorCommand request, CancellationToken cancellationToken)
    {
        var ugovor = await _context.Ugovori.FirstOrDefaultAsync(u => u.UgovorId == request.UgovorId, cancellationToken);
        if (ugovor == null)
            return new CompleteUgovorCommandDto { Success = false, Message = "Ugovor nije pronađen" };
        if (ugovor.Status != "Aktivan" ||
            (_currentUser.UserId != ugovor.KupacId && _currentUser.UserId != ugovor.MajstorId))
            return new CompleteUgovorCommandDto { Success = false, Message = "Ugovor se ne može završiti iz trenutnog stanja ili korisnik nije učesnik." };

        ugovor.Status = "Završen";
        await _context.SaveChangesAsync(cancellationToken);

        return new CompleteUgovorCommandDto
        {
            Success = true,
            Message = "Ugovor je označen kao završen"
        };
    }
}
