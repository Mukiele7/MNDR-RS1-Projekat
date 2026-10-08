namespace MNDR.Application.Modules.Admin;

public sealed class AdminService(IAppDbContext context) : IAdminService
{
    private static readonly string[] AllowedRoles = ["Kupac", "Majstor", "Administrator"];
    private static readonly string[] AllowedListingStatuses = ["Aktivan", "Neaktivan", "Završen", "Odobren", "Odbijen"];

    public async Task<AdminOverviewResponse> GetOverviewAsync(CancellationToken cancellationToken)
    {
        return new AdminOverviewResponse(
            await context.Korisnici.CountAsync(cancellationToken),
            await context.Majstori.CountAsync(cancellationToken),
            await context.Kupci.CountAsync(cancellationToken),
            await context.Oglasi.CountAsync(cancellationToken),
            await context.Oglasi.CountAsync(o => o.Status == "Aktivan", cancellationToken),
            await context.Ugovori.CountAsync(cancellationToken),
            await context.Recenzije.CountAsync(cancellationToken),
            await context.Razgovori.CountAsync(cancellationToken));
    }

    public async Task<IReadOnlyList<AdminUserResponse>> GetUsersAsync(string? search, CancellationToken cancellationToken)
    {
        var query = context.Korisnici.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(search))
        {
            var normalizedSearch = search.Trim();
            query = query.Where(k =>
                k.Email.Contains(normalizedSearch) ||
                k.Ime.Contains(normalizedSearch) ||
                k.Prezime.Contains(normalizedSearch));
        }

        var users = await query
            .OrderByDescending(k => k.DatumRegistracije)
            .Select(k => new { k.KorisnikId, k.Ime, k.Prezime, k.Email, k.Uloga, k.Grad, k.DatumRegistracije })
            .ToListAsync(cancellationToken);

        return users.Select(k => new AdminUserResponse(
            k.KorisnikId, k.Ime, k.Prezime, k.Email, k.Uloga, k.Grad,
            new DateTimeOffset(k.DatumRegistracije))).ToList();
    }

    public async Task<IReadOnlyList<AdminListingResponse>> GetListingsAsync(CancellationToken cancellationToken)
    {
        var listings = await context.Oglasi
            .AsNoTracking()
            .OrderByDescending(o => o.DatumObjave)
            .Select(o => new
            {
                o.OglasId, o.MajstorId, o.Naslov, o.Status,
                MajstorIme = o.Majstor!.Korisnik!.Ime + " " + o.Majstor.Korisnik.Prezime,
                o.DatumObjave
            })
            .ToListAsync(cancellationToken);

        return listings.Select(o => new AdminListingResponse(
            o.OglasId, o.MajstorId, o.Naslov, o.Status, o.MajstorIme,
            new DateTimeOffset(o.DatumObjave))).ToList();
    }

    public async Task<IReadOnlyList<AdminReviewResponse>> GetReviewsAsync(CancellationToken cancellationToken)
    {
        var reviews = await context.Recenzije
            .AsNoTracking()
            .OrderByDescending(r => r.DatumRecenzije)
            .Select(r => new
            {
                r.RecenzijaId,
                MajstorId = r.Ugovor!.MajstorId,
                KupacId = r.Ugovor.KupacId,
                r.Ocjena,
                r.Komentar,
                r.DatumRecenzije
            })
            .ToListAsync(cancellationToken);

        return reviews.Select(r => new AdminReviewResponse(
            r.RecenzijaId, r.MajstorId, r.KupacId, r.Ocjena, r.Komentar,
            new DateTimeOffset(r.DatumRecenzije))).ToList();
    }

    public async Task UpdateListingStatusAsync(int oglasId, string status, CancellationToken cancellationToken)
    {
        if (!AllowedListingStatuses.Contains(status, StringComparer.OrdinalIgnoreCase))
            throw new MndrConflictException("Status oglasa nije podržan.");

        var listing = await context.Oglasi.SingleOrDefaultAsync(o => o.OglasId == oglasId, cancellationToken)
            ?? throw new MndrNotFoundException("Oglas nije pronađen.");

        listing.Status = status;
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateUserRoleAsync(int korisnikId, string role, CancellationToken cancellationToken)
    {
        if (!AllowedRoles.Contains(role, StringComparer.OrdinalIgnoreCase))
            throw new MndrConflictException("Uloga korisnika nije podržana.");

        var user = await context.Korisnici
            .Include(k => k.Administrator)
            .SingleOrDefaultAsync(k => k.KorisnikId == korisnikId, cancellationToken)
            ?? throw new MndrNotFoundException("Korisnik nije pronađen.");

        var normalizedRole = AllowedRoles.First(r => r.Equals(role, StringComparison.OrdinalIgnoreCase));
        user.Uloga = normalizedRole;

        if (normalizedRole == "Administrator" && user.Administrator is null)
        {
            context.Administratori.Add(new Administrator
            {
                KorisnikId = user.KorisnikId,
                NivoPristupa = "Potpun",
                Aktivan = true,
                DatumDodavanja = DateTime.UtcNow
            });
        }

        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteReviewAsync(int recenzijaId, CancellationToken cancellationToken)
    {
        var review = await context.Recenzije.FindAsync([recenzijaId], cancellationToken)
            ?? throw new MndrNotFoundException("Recenzija nije pronađena.");

        context.Recenzije.Remove(review);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteUserAsync(int korisnikId, int currentUserId, CancellationToken cancellationToken)
    {
        if (korisnikId == currentUserId)
            throw new MndrForbiddenException("Administrator ne može obrisati sopstveni nalog.");

        var user = await context.Korisnici.FindAsync([korisnikId], cancellationToken)
            ?? throw new MndrNotFoundException("Korisnik nije pronađen.");

        context.Korisnici.Remove(user);
        try
        {
            await context.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception)
        {
            throw new MndrConflictException(
                "Korisnik ne može biti obrisan dok postoje povezani podaci.",
                exception);
        }
    }
}
