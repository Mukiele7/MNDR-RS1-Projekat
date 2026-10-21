using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MNDR.Domain.Entities;

namespace MNDR.Infrastructure.Data;

public static class AppDataSeeder
{
    public static async Task SeedAsync(MndrDbContext context, CancellationToken cancellationToken = default)
    {
        var hasher = new PasswordHasher<Korisnik>();
        await EnsureUserAsync(context, hasher, "admin@test.com", "Admin", "Test", "Administrator", "Admin123", cancellationToken);
        await EnsureUserAsync(context, hasher, "marko@mail.com", "Marko", "Markovic", "Majstor", "Marko123", cancellationToken);
        await EnsureUserAsync(context, hasher, "ana@mail.com", "Ana", "Anic", "Kupac", "Ana123", cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    private static async Task EnsureUserAsync(
        MndrDbContext context,
        IPasswordHasher<Korisnik> hasher,
        string email,
        string firstName,
        string lastName,
        string role,
        string password,
        CancellationToken cancellationToken)
    {
        var user = await context.Korisnici
            .Include(x => x.Majstor)
            .Include(x => x.Kupac)
            .Include(x => x.Administrator)
            .FirstOrDefaultAsync(x => x.Email == email, cancellationToken);

        if (user is null)
        {
            user = new Korisnik
            {
                Email = email,
                Ime = firstName,
                Prezime = lastName,
                Uloga = role,
                Telefon = "061234567",
                DatumRegistracije = DateTime.UtcNow
            };
            user.Lozinka = hasher.HashPassword(user, password);
            context.Korisnici.Add(user);
            await context.SaveChangesAsync(cancellationToken);
        }

        if (role == "Administrator" && user.Administrator is null)
            context.Administratori.Add(new Administrator { KorisnikId = user.KorisnikId, NivoPristupa = "Standard", Aktivan = true, DatumDodavanja = DateTime.UtcNow });
        else if (role == "Majstor" && user.Majstor is null)
            context.Majstori.Add(new Majstor { KorisnikId = user.KorisnikId, Specijalizacija = "Keramika", GodineIskustva = 5, CijenaMjesecne = 1500 });
        else if (role == "Kupac" && user.Kupac is null)
            context.Kupci.Add(new Kupac { KorisnikId = user.KorisnikId });
    }
}
