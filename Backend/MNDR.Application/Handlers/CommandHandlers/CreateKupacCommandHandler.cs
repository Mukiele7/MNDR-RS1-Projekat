using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MNDR.Application.Abstractions;
using MNDR.Application.Commands;
using MNDR.Domain.Entities;
using System.Security.Cryptography;
using System.Text;

namespace MNDR.Application.Handlers.CommandHandlers
{
    public class CreateKupacCommandHandler : IRequestHandler<CreateKupacCommand, CreateKupacResponse>
    {
        private readonly IAppDbContext _context;
        private readonly IPasswordHasher<Korisnik> _passwordHasher;

        public CreateKupacCommandHandler(IAppDbContext context, IPasswordHasher<Korisnik> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        public async Task<CreateKupacResponse> Handle(CreateKupacCommand request, CancellationToken cancellationToken)
        {
            // Validacija email formata (*@*.com)
            var emailPattern = @"^[^@\s]+@[^@\s]+\.com$";
            if (!System.Text.RegularExpressions.Regex.IsMatch(request.Email, emailPattern, System.Text.RegularExpressions.RegexOptions.IgnoreCase))
                return new CreateKupacResponse
                {
                    Success = false,
                    Message = "Email mora biti u formatu: primjer@domen.com"
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
                return new CreateKupacResponse
                {
                    Success = false,
                    Message = "Unesite broj: 061234567 ili +38761234567"
                };

            // Provera da li email već postoji
            var emailExists = await _context.Korisnici
                .AnyAsync(k => k.Email == request.Email, cancellationToken);

            if (emailExists)
                return new CreateKupacResponse
                {
                    Success = false,
                    Message = "Email je već registrovan"
                };

            // Validacija lozinke
            if (request.Lozinka.Length < 6)
                return new CreateKupacResponse
                {
                    Success = false,
                    Message = "Lozinka mora imati najmanje 6 karaktera"
                };

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
                SlikaProfila = await SaveProfileImage(request.SlikaProfila)
            };

            // Hash lozinke koristeći ASP.NET Core Identity PasswordHasher
            korisnik.Lozinka = _passwordHasher.HashPassword(korisnik, request.Lozinka);

            _context.Korisnici.Add(korisnik);
            await _context.SaveChangesAsync(cancellationToken);

            // Kreiranje kupca
            var kupac = new Kupac
            {
                KorisnikId = korisnik.KorisnikId,
                BrojNarudzbi = 0,
                OcjenaPouzdanosti = 0
            };

            _context.Kupci.Add(kupac);
            await _context.SaveChangesAsync(cancellationToken);

            return new CreateKupacResponse
            {
                Success = true,
                Message = "Kupac je uspješno kreiran",
                KupacId = kupac.KorisnikId
            };
        }

        private async Task<string?> SaveProfileImage(Microsoft.AspNetCore.Http.IFormFile? file)
        {
            if (file == null || file.Length == 0)
                return null;

            try
            {
                // Validacija formata
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                
                if (!allowedExtensions.Contains(extension))
                    return null;

                // Validacija veličine (5MB)
                if (file.Length > 5 * 1024 * 1024)
                    return null;

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
            catch
            {
                return null;
            }
        }
    }

    public class UpdateKupacCommandHandler : IRequestHandler<UpdateKupacCommand, UpdateKupacResponse>
    {
        private readonly IAppDbContext _context;

        public UpdateKupacCommandHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<UpdateKupacResponse> Handle(UpdateKupacCommand request, CancellationToken cancellationToken)
        {
            var kupac = await _context.Kupci
                .Include(k => k.Korisnik)
                .FirstOrDefaultAsync(k => k.KorisnikId == request.KorisnikId, cancellationToken);

            if (kupac == null)
                return new UpdateKupacResponse
                {
                    Success = false,
                    Message = "Kupac nije pronađen"
                };

            // Ažuriraj korisnika
            kupac.Korisnik!.Ime = request.Ime.Trim();
            kupac.Korisnik.Prezime = request.Prezime.Trim();
            kupac.Korisnik.Grad = request.Grad?.Trim();
            kupac.Korisnik.Opcina = request.Opcina?.Trim();
            kupac.Korisnik.OpisProfila = request.Adresa?.Trim();

            await _context.SaveChangesAsync(cancellationToken);

            return new UpdateKupacResponse
            {
                Success = true,
                Message = "Profil kupca je uspješno ažuriran"
            };
        }
    }

    public class DeleteKupacCommandHandler : IRequestHandler<DeleteKupacCommand, DeleteKupacResponse>
    {
        private readonly IAppDbContext _context;

        public DeleteKupacCommandHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<DeleteKupacResponse> Handle(DeleteKupacCommand request, CancellationToken cancellationToken)
        {
            var kupac = await _context.Kupci
                .Include(k => k.Korisnik)
                .FirstOrDefaultAsync(k => k.KorisnikId == request.KorisnikId, cancellationToken);

            if (kupac == null)
                return new DeleteKupacResponse
                {
                    Success = false,
                    Message = "Kupac nije pronađen"
                };

            // Obriši kupca
            _context.Kupci.Remove(kupac);

            // Obriši korisnika
            if (kupac.Korisnik != null)
                _context.Korisnici.Remove(kupac.Korisnik);

            await _context.SaveChangesAsync(cancellationToken);

            return new DeleteKupacResponse
            {
                Success = true,
                Message = "Profil kupca je uspješno obrisan"
            };
        }
    }
}
