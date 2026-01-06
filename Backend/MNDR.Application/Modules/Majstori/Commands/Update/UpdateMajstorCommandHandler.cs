namespace MNDR.Application.Modules.Majstori.Commands.Update;

public class UpdateMajstorCommandHandler(IAppDbContext context)
    : IRequestHandler<UpdateMajstorCommand, UpdateMajstorResponse>
{
    public async Task<UpdateMajstorResponse> Handle(UpdateMajstorCommand request, CancellationToken cancellationToken)
    {
        var majstor = await context.Majstori
            .Include(m => m.Korisnik)
            .FirstOrDefaultAsync(m => m.KorisnikId == request.KorisnikId, cancellationToken);

        if (majstor == null)
            return new UpdateMajstorResponse
            {
                Success = false,
                Message = "Majstor nije pronađen"
            };

        if (majstor.Korisnik == null || majstor.Korisnik.Uloga != "Majstor")
            return new UpdateMajstorResponse
            {
                Success = false,
                Message = "Korisnik nije majstor"
            };

        // Validacija imena i prezimena
        if (string.IsNullOrWhiteSpace(request.Ime) || request.Ime.Length < 2)
            return new UpdateMajstorResponse
            {
                Success = false,
                Message = "Ime mora imati najmanje 2 karaktera"
            };

        if (string.IsNullOrWhiteSpace(request.Prezime) || request.Prezime.Length < 2)
            return new UpdateMajstorResponse
            {
                Success = false,
                Message = "Prezime mora imati najmanje 2 karaktera"
            };

        // Validacija specijalizacije
        if (string.IsNullOrWhiteSpace(request.Specijalizacija))
            return new UpdateMajstorResponse
            {
                Success = false,
                Message = "Specijalizacija je obavezna"
            };

        // Validacija godina iskustva
        if (request.GodineIskustva < 0)
            return new UpdateMajstorResponse
            {
                Success = false,
                Message = "Godine iskustva ne mogu biti negativne"
            };

        // Validacija cijene
        if (request.CijenaMjesecne < 0 && request.CijenaSat < 0)
            return new UpdateMajstorResponse
            {
                Success = false,
                Message = "Cijena ne može biti negativna"
            };

        // Ažuriranje podataka korisnika
        majstor.Korisnik.Ime = request.Ime.Trim();
        majstor.Korisnik.Prezime = request.Prezime.Trim();
        majstor.Korisnik.Grad = request.Grad?.Trim();
        majstor.Korisnik.Opcina = request.Opcina?.Trim();

        // Ažuriranje podataka majstora
        majstor.Specijalizacija = request.Specijalizacija.Trim();
        majstor.GodineIskustva = request.GodineIskustva;
        
        // Ako je poslat CijenaSat, izračunaj CijenaMjesecne
        if (request.CijenaSat > 0)
        {
            majstor.CijenaSat = request.CijenaSat;
            majstor.CijenaMjesecne = request.CijenaSat * 160; // 160 sati mjesečno
        }
        else if (request.CijenaMjesecne > 0)
        {
            majstor.CijenaMjesecne = request.CijenaMjesecne;
            majstor.CijenaSat = request.CijenaMjesecne / 160;
        }
        
        // Ažuriraj opis profila (podrška za oba polja)
        if (!string.IsNullOrEmpty(request.OpisProfila))
            majstor.OpisProfila = request.OpisProfila.Trim();
        else if (!string.IsNullOrEmpty(request.DetaljanOpisProfila))
            majstor.OpisProfila = request.DetaljanOpisProfila.Trim();

        await context.SaveChangesAsync(cancellationToken);

        return new UpdateMajstorResponse
        {
            Success = true,
            Message = "Majstor je uspešno ažuriran"
        };
    }
}
