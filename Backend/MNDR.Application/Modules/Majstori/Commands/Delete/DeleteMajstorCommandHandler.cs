namespace MNDR.Application.Modules.Majstori.Commands.Delete;

public class DeleteMajstorCommandHandler(IAppDbContext context)
    : IRequestHandler<DeleteMajstorCommand, DeleteMajstorResponse>
{
    public async Task<DeleteMajstorResponse> Handle(DeleteMajstorCommand request, CancellationToken cancellationToken)
    {
        var majstor = await context.Majstori
            .Include(m => m.Korisnik)
            .FirstOrDefaultAsync(m => m.KorisnikId == request.KorisnikId, cancellationToken);

        if (majstor == null)
            return new DeleteMajstorResponse
            {
                Success = false,
                Message = "Majstor nije pronađen"
            };

        // Prvo obriši sve povezane entitete (u pravilnom redosledu zbog foreign keys)

        // 1. Recenzije (preko Ugovora koji pripadaju oglasima ovog majstora)
        var majstorOglasi = await context.Oglasi
            .Where(o => o.MajstorId == request.KorisnikId)
            .Select(o => o.OglasId)
            .ToListAsync(cancellationToken);

        // Brisi recenzije koje pripadaju ugovorima ovih oglasa
        var recenzije = await context.Recenzije
            .Where(r => context.Ugovori.Any(u => u.UgovorId == r.UgovorId && majstorOglasi.Contains(u.OglasId)))
            .ToListAsync(cancellationToken);
        if (recenzije.Any())
            context.Recenzije.RemoveRange(recenzije);

        // 2. Ugovori
        var ugovori = await context.Ugovori
            .Where(u => majstorOglasi.Contains(u.OglasId))
            .ToListAsync(cancellationToken);
        if (ugovori.Any())
            context.Ugovori.RemoveRange(ugovori);

        // 3. Razgovori i poruke
        var razgovori = await context.Razgovori
            .Where(r => r.MajstorId == request.KorisnikId)
            .ToListAsync(cancellationToken);
        
        var razgovorIds = razgovori.Select(r => r.RazgovorId).ToList();
        var poruke = await context.RazgovorPoruke
            .Where(p => razgovorIds.Contains(p.RazgovorId))
            .ToListAsync(cancellationToken);
        
        if (poruke.Any())
            context.RazgovorPoruke.RemoveRange(poruke);
        if (razgovori.Any())
            context.Razgovori.RemoveRange(razgovori);

        // 4. Oglasi (i njihove kategorije)
        var oglasi = await context.Oglasi
            .Where(o => o.MajstorId == request.KorisnikId)
            .Include(o => o.OglasKategorije)
            .ToListAsync(cancellationToken);

        foreach (var oglas in oglasi)
        {
            if (oglas.OglasKategorije.Any())
                context.OglasKategorije.RemoveRange(oglas.OglasKategorije);
        }

        if (oglasi.Any())
            context.Oglasi.RemoveRange(oglasi);

        // 5. Krediti
        var krediti = await context.Krediti
            .Where(k => k.MajstorId == request.KorisnikId)
            .ToListAsync(cancellationToken);

        if (krediti.Any())
            context.Krediti.RemoveRange(krediti);

        // 6. BadgeNagrade
        var badgeNagrade = await context.BadgeNagrade
            .Where(bn => bn.MajstorId == request.KorisnikId)
            .ToListAsync(cancellationToken);

        if (badgeNagrade.Any())
            context.BadgeNagrade.RemoveRange(badgeNagrade);

        // Na kraju obriši majstora
        context.Majstori.Remove(majstor);

        // Obriši korisnika
        if (majstor.Korisnik != null)
            context.Korisnici.Remove(majstor.Korisnik);

        await context.SaveChangesAsync(cancellationToken);

        return new DeleteMajstorResponse
        {
            Success = true,
            Message = "Majstor je uspešno obrisan"
        };
    }
}
