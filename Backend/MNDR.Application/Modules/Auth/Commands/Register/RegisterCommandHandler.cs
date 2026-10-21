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
        _ => throw new ArgumentException("Javna registracija ne dozvoljava ovu ulogu")
    };
}
