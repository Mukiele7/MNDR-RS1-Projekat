using Microsoft.EntityFrameworkCore;
using MNDR.Domain.Entities;

namespace MNDR.Application.Abstractions;

/// <summary>
/// Interfejs za pristup bazi podataka.
/// Application layer zavisi od ovog interfejsa, a ne od konkretnog DbContext-a.
/// Ovo omogućava Clean Architecture i lakše testiranje.
/// </summary>
public interface IAppDbContext
{
    // Korisnici i role
    DbSet<Korisnik> Korisnici { get; }
    DbSet<Administrator> Administratori { get; }
    DbSet<Kupac> Kupci { get; }
    DbSet<Majstor> Majstori { get; }

    // Oglasi i kategorije
    DbSet<Oglas> Oglasi { get; }
    DbSet<Kategorija> Kategorije { get; }
    DbSet<OglasKategorija> OglasKategorije { get; }

    // Komunikacija
    DbSet<Razgovor> Razgovori { get; }
    DbSet<RazgovorPoruka> RazgovorPoruke { get; }
    DbSet<Notifikacija> Notifikacije { get; }

    // Ugovori i recenzije
    DbSet<Ugovor> Ugovori { get; }
    DbSet<Recenzija> Recenzije { get; }

    // Krediti i badge-ovi
    DbSet<Kredit> Krediti { get; }
    DbSet<Badge> Badges { get; }
    DbSet<BadgeNagrada> BadgeNagrade { get; }

    // Refresh Tokens
    DbSet<RefreshToken> RefreshTokens { get; }

    // Favorites
    DbSet<OmiljeniMajstor> OmiljeniMajstori { get; }

    /// <summary>
    /// Čuva sve promene u bazi podataka.
    /// </summary>
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
