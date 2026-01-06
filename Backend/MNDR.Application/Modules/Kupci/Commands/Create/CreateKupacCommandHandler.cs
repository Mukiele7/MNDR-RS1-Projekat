namespace MNDR.Application.Modules.Kupci.Commands.Create;

public class CreateKupacCommandHandler(
    IAppDbContext context,
    IPasswordHasher<Korisnik> passwordHasher)
    : IRequestHandler<CreateKupacCommand, int>
{
    public async Task<int> Handle(CreateKupacCommand request, CancellationToken cancellationToken)
    {
        // Provera da li email već postoji
        var emailExists = await context.Korisnici
            .AnyAsync(k => k.Email == request.Email.ToLower(), cancellationToken);

        if (emailExists)
            throw new ValidationException("Email je već registrovan");

        // Kreiranje korisnika
        var korisnik = new Korisnik
        {
            Ime = request.Ime.Trim(),
            Prezime = request.Prezime.Trim(),
            KorisnickoIme = request.KorisnickoIme?.Trim(),
            Email = request.Email.Trim().ToLower(),
            Telefon = request.Telefon,
            Uloga = "Kupac",
            DatumRegistracije = DateTime.UtcNow,
            Grad = request.Grad?.Trim(),
            Opcina = request.Opcina?.Trim(),
            OpisProfila = request.OpisProfila?.Trim(),
            SlikaProfila = await SaveProfileImageAsync(request.SlikaProfila)
        };

        // Hash lozinke
        korisnik.Lozinka = passwordHasher.HashPassword(korisnik, request.Lozinka);

        context.Korisnici.Add(korisnik);
        await context.SaveChangesAsync(cancellationToken);

        // Kreiranje kupca
        var kupac = new Kupac
        {
            KorisnikId = korisnik.KorisnikId,
            BrojNarudzbi = 0,
            OcjenaPouzdanosti = 0
        };

        context.Kupci.Add(kupac);
        await context.SaveChangesAsync(cancellationToken);

        return kupac.KorisnikId;
    }

    private static async Task<string?> SaveProfileImageAsync(IFormFile? file)
    {
        if (file == null || file.Length == 0)
            return null;

        // Validacija formata
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        
        if (!allowedExtensions.Contains(extension))
            throw new ValidationException("Dozvoljeni formati slike su: jpg, jpeg, png, gif");

        // Validacija veličine (5MB)
        if (file.Length > 5 * 1024 * 1024)
            throw new ValidationException("Slika ne može biti veća od 5MB");

        // Kreiranje jedinstvenog imena
        var fileName = $"{Guid.NewGuid()}{extension}";
        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "profiles");
        
        // Kreiranje foldera ako ne postoji
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var filePath = Path.Combine(uploadsFolder, fileName);

        // Čuvanje fajla
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return $"/uploads/profiles/{fileName}";
    }
}
