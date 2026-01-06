namespace MNDR.Application.Modules.Majstori.Commands.Create;

public class CreateMajstorCommandHandler(
    IAppDbContext context,
    IPasswordHasher<Korisnik> passwordHasher)
    : IRequestHandler<CreateMajstorCommand, CreateMajstorResponse>
{
    public async Task<CreateMajstorResponse> Handle(CreateMajstorCommand request, CancellationToken cancellationToken)
    {
        // Provera da li email već postoji
        var emailExists = await context.Korisnici
            .AnyAsync(k => k.Email == request.Email.ToLower(), cancellationToken);

        if (emailExists)
            return new CreateMajstorResponse
            {
                Success = false,
                Message = "Email je već registrovan"
            };

        // Kreiranje korisnika
        var korisnik = new Korisnik
        {
            Ime = request.Ime.Trim(),
            Prezime = request.Prezime.Trim(),
            Email = request.Email.Trim().ToLower(),
            Telefon = request.Telefon,
            Uloga = "Majstor",
            DatumRegistracije = DateTime.UtcNow,
            Grad = request.Grad?.Trim(),
            Opcina = request.Opcina?.Trim()
        };

        // Hash lozinke
        korisnik.Lozinka = passwordHasher.HashPassword(korisnik, request.Lozinka);

        context.Korisnici.Add(korisnik);
        await context.SaveChangesAsync(cancellationToken);

        // Kreiranje majstora
        var majstor = new Majstor
        {
            KorisnikId = korisnik.KorisnikId,
            Specijalizacija = request.Specijalizacija.Trim(),
            GodineIskustva = request.GodineIskustva,
            CijenaMjesecne = request.CijenaMjesecne,
            DetaljanOpisProfila = request.DetaljanOpisProfila?.Trim(),
            ProsjecnaOcjena = 0,
            BrojZavrsenihPoslova = 0
        };

        context.Majstori.Add(majstor);
        await context.SaveChangesAsync(cancellationToken);

        return new CreateMajstorResponse
        {
            Success = true,
            Message = "Majstor je uspešno kreiran",
            MajstorId = majstor.KorisnikId
        };
    }
}
