using MediatR;
using Microsoft.EntityFrameworkCore;
using MNDR.Application.Abstractions;
using MNDR.Application.Commands;
using MNDR.Domain.Entities;
using System.Security.Cryptography;
using System.Text;

namespace MNDR.Application.Handlers.CommandHandlers
{
    public class CreateMajstorCommandHandler : IRequestHandler<CreateMajstorCommand, CreateMajstorResponse>
    {
        private readonly IAppDbContext _context;

        public CreateMajstorCommandHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<CreateMajstorResponse> Handle(CreateMajstorCommand request, CancellationToken cancellationToken)
        {
            // Validacija email formata (*@*.com)
            var emailPattern = @"^[^@\s]+@[^@\s]+\.com$";
            if (!System.Text.RegularExpressions.Regex.IsMatch(request.Email, emailPattern))
                return new CreateMajstorResponse
                {
                    Success = false,
                    Message = "Email mora biti u formatu: primer@domen.com"
                };

            // Validacija telefona
            var cleaned = request.Telefon.Replace(" ", "").Replace("-", "").Replace("(", "").Replace(")", "");
            bool isValid = false;
            
            if (cleaned.StartsWith("+387") && cleaned.Length == 12 && cleaned[4] >= '6' && cleaned[4] <= '9')
                isValid = true;
            else if (cleaned.StartsWith("0") && cleaned.Length == 9 && cleaned[1] >= '6' && cleaned[1] <= '9')
                isValid = true;
            else if (cleaned.Length == 8 && cleaned[0] >= '6' && cleaned[0] <= '9')
                isValid = true;
            
            if (!isValid)
                return new CreateMajstorResponse
                {
                    Success = false,
                    Message = "Unesite broj: 061234567 ili +38761234567"
                };

            // Provera da li email već postoji
            var emailExists = await _context.Korisnici
                .AnyAsync(k => k.Email == request.Email, cancellationToken);

            if (emailExists)
                return new CreateMajstorResponse
                {
                    Success = false,
                    Message = "Email je već registrovan"
                };

            // Validacija lozinke
            if (request.Lozinka.Length < 6)
                return new CreateMajstorResponse
                {
                    Success = false,
                    Message = "Lozinka mora imati najmanje 6 karaktera"
                };

            // Validacija specijalizacije
            if (string.IsNullOrWhiteSpace(request.Specijalizacija))
                return new CreateMajstorResponse
                {
                    Success = false,
                    Message = "Specijalizacija je obavezna"
                };

            // Validacija godina iskustva
            if (request.GodineIskustva < 0)
                return new CreateMajstorResponse
                {
                    Success = false,
                    Message = "Godine iskustva ne mogu biti negativne"
                };

            // Validacija cijene
            if (request.CijenaMjesecne < 0)
                return new CreateMajstorResponse
                {
                    Success = false,
                    Message = "Cijena ne može biti negativna"
                };

            // Kreiranje korisnika
            var korisnik = new Korisnik
            {
                Ime = request.Ime.Trim(),
                Prezime = request.Prezime.Trim(),
                Email = request.Email.Trim().ToLower(),
                Telefon = request.Telefon,
                Lozinka = HashPassword(request.Lozinka),
                Uloga = "Majstor",
                DatumRegistracije = DateTime.UtcNow,
                Grad = request.Grad?.Trim(),
                Opcina = request.Opcina?.Trim()
            };

            _context.Korisnici.Add(korisnik);
            await _context.SaveChangesAsync(cancellationToken);

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

            _context.Majstori.Add(majstor);
            await _context.SaveChangesAsync(cancellationToken);

            return new CreateMajstorResponse
            {
                Success = true,
                Message = "Majstor je uspešno kreiran",
                MajstorId = majstor.KorisnikId
            };
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }
    }

    public class UpdateMajstorCommandHandler : IRequestHandler<UpdateMajstorCommand, UpdateMajstorResponse>
    {
        private readonly IAppDbContext _context;

        public UpdateMajstorCommandHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<UpdateMajstorResponse> Handle(UpdateMajstorCommand request, CancellationToken cancellationToken)
        {
            var majstor = await _context.Majstori
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

            await _context.SaveChangesAsync(cancellationToken);

            return new UpdateMajstorResponse
            {
                Success = true,
                Message = "Majstor je uspešno ažuriran"
            };
        }
    }

    public class DeleteMajstorCommandHandler : IRequestHandler<DeleteMajstorCommand, DeleteMajstorResponse>
    {
        private readonly IAppDbContext _context;

        public DeleteMajstorCommandHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<DeleteMajstorResponse> Handle(DeleteMajstorCommand request, CancellationToken cancellationToken)
        {
            var majstor = await _context.Majstori
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
            var majstorOglasi = await _context.Oglasi
                .Where(o => o.MajstorId == request.KorisnikId)
                .Select(o => o.OglasId)
                .ToListAsync(cancellationToken);

            // Brisi recenzije koje pripadaju ugovorima ovih oglasa
            var recenzije = await _context.Recenzije
                .Where(r => _context.Ugovori.Any(u => u.UgovorId == r.UgovorId && majstorOglasi.Contains(u.OglasId)))
                .ToListAsync(cancellationToken);
            if (recenzije.Any())
                _context.Recenzije.RemoveRange(recenzije);

            // 2. Ugovori
            var ugovori = await _context.Ugovori
                .Where(u => majstorOglasi.Contains(u.OglasId))
                .ToListAsync(cancellationToken);
            if (ugovori.Any())
                _context.Ugovori.RemoveRange(ugovori);

            // 3. Razgovori i poruke
            var razgovori = await _context.Razgovori
                .Where(r => r.MajstorId == request.KorisnikId)
                .ToListAsync(cancellationToken);
            
            var razgovorIds = razgovori.Select(r => r.RazgovorId).ToList();
            var poruke = await _context.RazgovorPoruke
                .Where(p => razgovorIds.Contains(p.RazgovorId))
                .ToListAsync(cancellationToken);
            
            if (poruke.Any())
                _context.RazgovorPoruke.RemoveRange(poruke);
            if (razgovori.Any())
                _context.Razgovori.RemoveRange(razgovori);

            // 4. Oglasi (i njihove kategorije)
            var oglasi = await _context.Oglasi
                .Where(o => o.MajstorId == request.KorisnikId)
                .Include(o => o.OglasKategorije)
                .ToListAsync(cancellationToken);

            foreach (var oglas in oglasi)
            {
                if (oglas.OglasKategorije.Any())
                    _context.OglasKategorije.RemoveRange(oglas.OglasKategorije);
            }

            if (oglasi.Any())
                _context.Oglasi.RemoveRange(oglasi);

            // 5. Krediti
            var krediti = await _context.Krediti
                .Where(k => k.MajstorId == request.KorisnikId)
                .ToListAsync(cancellationToken);

            if (krediti.Any())
                _context.Krediti.RemoveRange(krediti);

            // 6. BadgeNagrade
            var badgeNagrade = await _context.BadgeNagrade
                .Where(bn => bn.MajstorId == request.KorisnikId)
                .ToListAsync(cancellationToken);

            if (badgeNagrade.Any())
                _context.BadgeNagrade.RemoveRange(badgeNagrade);

            // Na kraju obriši majstora
            _context.Majstori.Remove(majstor);

            await _context.SaveChangesAsync(cancellationToken);

            return new DeleteMajstorResponse
            {
                Success = true,
                Message = "Majstor je uspešno obrisan"
            };
        }
    }
}
