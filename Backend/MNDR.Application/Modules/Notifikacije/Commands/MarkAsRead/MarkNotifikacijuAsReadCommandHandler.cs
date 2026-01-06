namespace MNDR.Application.Modules.Notifikacije.Commands.MarkAsRead;

public sealed class MarkNotifikacijuAsReadCommandHandler : IRequestHandler<MarkNotifikacijuAsReadCommand, MarkNotifikacijuAsReadCommandDto>
{
    private readonly IAppDbContext _context;

    public MarkNotifikacijuAsReadCommandHandler(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<MarkNotifikacijuAsReadCommandDto> Handle(MarkNotifikacijuAsReadCommand request, CancellationToken cancellationToken)
    {
        var notifikacija = await _context.Notifikacije.FirstOrDefaultAsync(n => n.NotifikacijaId == request.NotifikacijaId, cancellationToken);
        if (notifikacija == null)
            return new MarkNotifikacijuAsReadCommandDto { Success = false, Message = "Notifikacija nije pronađena" };

        notifikacija.Procitano = true;
        await _context.SaveChangesAsync(cancellationToken);

        return new MarkNotifikacijuAsReadCommandDto
        {
            Success = true,
            Message = "Notifikacija je označena kao pročitana"
        };
    }
}
