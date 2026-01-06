namespace MNDR.Application.Modules.Ugovori.Commands.Complete;

public sealed class CompleteUgovorCommandHandler : IRequestHandler<CompleteUgovorCommand, CompleteUgovorCommandDto>
{
    private readonly IAppDbContext _context;

    public CompleteUgovorCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<CompleteUgovorCommandDto> Handle(CompleteUgovorCommand request, CancellationToken cancellationToken)
    {
        var ugovor = await _context.Ugovori.FirstOrDefaultAsync(u => u.UgovorId == request.UgovorId, cancellationToken);
        if (ugovor == null)
            return new CompleteUgovorCommandDto { Success = false, Message = "Ugovor nije pronađen" };

        ugovor.Status = "Završen";
        await _context.SaveChangesAsync(cancellationToken);

        return new CompleteUgovorCommandDto
        {
            Success = true,
            Message = "Ugovor je označen kao završen"
        };
    }
}
