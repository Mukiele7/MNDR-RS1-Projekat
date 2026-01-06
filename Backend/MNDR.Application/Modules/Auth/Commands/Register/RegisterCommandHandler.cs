using Microsoft.AspNetCore.Identity;

namespace MNDR.Application.Modules.Auth.Commands.Register;

/// <summary>
/// Handler za RegisterCommand.
/// Kreira novog korisnika i odgovarajući role-specific entitet (Administrator, Majstor, Kupac).
/// </summary>
public sealed class RegisterCommandHandler : IRequestHandler<RegisterCommand, RegisterCommandDto>
{
    private readonly IAppDbContext _context;
    private readonly IPasswordHasher<Korisnik> _passwordHasher;

    public RegisterCommandHandler(IAppDbContext context, IPasswordHasher<Korisnik> passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<RegisterCommandDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // Proveri da li email već postoji
        var emailExists = await _context.Korisnici
            .AnyAsync(u => u.Email == request.Email, cancellationToken);

        if (emailExists)
        {
            throw new MndrConflictException("Email je već registrovan.");
        }

        // TODO: PRIVREMENO ISKLJUČENO ZA TESTIRANJE - Vratiti posle!
        // Ograniči kreiranje administratora - samo prva 2 korisnika
        /*
        if (request.Role == 2) // Administrator
        {
            var adminCount = await _context.Administratori.CountAsync(cancellationToken);
            if (adminCount >= 2)
            {
                throw new MndrForbiddenException(
                    "Maksimalan broj administratora je dostignut. Registrujte se kao Majstor ili Kupac.");
            }
        }
        */

        // Kreiraj korisnika
        var user = new Korisnik
        {
            Ime = request.FirstName,
            Prezime = request.LastName,
            Email = request.Email,
            Telefon = request.PhoneNumber,
            Uloga = GetRoleName(request.Role),
            DatumRegistracije = DateTime.UtcNow
        };

        // Hash password using ASP.NET Core Identity PasswordHasher
        user.Lozinka = _passwordHasher.HashPassword(user, request.Password);

        _context.Korisnici.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        // Na osnovu uloge, kreiraj odgovarajući entitet
        switch (request.Role)
        {
            case 2: // Administrator
                var admin = new Administrator
                {
                    KorisnikId = user.KorisnikId,
                    NivoPristupa = "Standard",
                    DatumDodavanja = DateTime.UtcNow,
                    Aktivan = true
                };
                _context.Administratori.Add(admin);
                break;

            case 1: // Majstor
                var majstor = new Majstor
                {
                    KorisnikId = user.KorisnikId,
                    GodineIskustva = 0,
                    ProsjecnaOcjena = 0,
                    BrojZavrsenihPoslova = 0,
                    Specijalizacija = "Opšte",
                    CijenaMjesecne = 0
                };
                _context.Majstori.Add(majstor);
                break;

            case 0: // Kupac
                var kupac = new Kupac
                {
                    KorisnikId = user.KorisnikId,
                    BrojNarudzbi = 0,
                    OcjenaPouzdanosti = 0
                };
                _context.Kupci.Add(kupac);
                break;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new RegisterCommandDto
        {
            UserId = user.KorisnikId,
            Email = user.Email,
            Message = $"Uspješno ste se registrovali kao {GetRoleName(request.Role)}."
        };
    }

    private string GetRoleName(int role) => role switch
    {
        0 => "Kupac",
        1 => "Majstor",
        2 => "Administrator",
        _ => throw new ArgumentException("Nepoznata uloga")
    };
}
