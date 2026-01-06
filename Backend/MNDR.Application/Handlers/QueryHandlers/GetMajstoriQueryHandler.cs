using MediatR;
using Microsoft.EntityFrameworkCore;
using MNDR.Application.Abstractions;
using MNDR.Application.DTOs;
using MNDR.Application.Queries;

namespace MNDR.Application.Handlers.QueryHandlers
{
    public class GetMajstoriQueryHandler : IRequestHandler<GetMajstoriQuery, PagedMajstoriResult>
    {
        private readonly IAppDbContext _context;

        public GetMajstoriQueryHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedMajstoriResult> Handle(GetMajstoriQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Majstori
                .Include(m => m.Korisnik)
                .Where(m => m.Korisnik != null)
                .AsQueryable();

            // Filter 1: Specijalizacija
            if (!string.IsNullOrEmpty(request.Specijalizacija))
                query = query.Where(m => m.Specijalizacija.Contains(request.Specijalizacija));

            // Filter 2: MinOcjena
            if (request.MinOcjena.HasValue)
                query = query.Where(m => m.ProsjecnaOcjena >= request.MinOcjena.Value);

            // Filter 3: Grad
            if (!string.IsNullOrEmpty(request.Grad))
                query = query.Where(m => m.Korisnik!.Grad == request.Grad);

            // Filter 4: MinGodineIskustva
            if (request.MinGodineIskustva.HasValue)
                query = query.Where(m => m.GodineIskustva >= request.MinGodineIskustva.Value);

            // Filter 5: MaxCijena
            if (request.MaxCijena.HasValue)
                query = query.Where(m => m.CijenaMjesecne <= request.MaxCijena.Value);

            var totalCount = await query.CountAsync(cancellationToken);

            var items = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(m => new MajstorDto
                {
                    KorisnikId = m.KorisnikId,
                    Ime = m.Korisnik!.Ime,
                    Prezime = m.Korisnik.Prezime,
                    Email = m.Korisnik.Email,
                    Telefon = m.Korisnik.Telefon,
                    Grad = m.Korisnik.Grad,
                    Specijalizacija = m.Specijalizacija,
                    GodineIskustva = m.GodineIskustva,
                    ProsjecnaOcjena = m.ProsjecnaOcjena,
                    BrojZavrsenihPoslova = m.BrojZavrsenihPoslova,
                    CijenaMjesecne = m.CijenaMjesecne,
                    CijenaSat = m.CijenaMjesecne / 160 // Približno 160 sati mjesečno
                })
                .ToListAsync(cancellationToken);

            return new PagedMajstoriResult
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };
        }
    }

    public class GetMajstorByIdQueryHandler : IRequestHandler<GetMajstorByIdQuery, MajstorDto?>
    {
        private readonly IAppDbContext _context;

        public GetMajstorByIdQueryHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<MajstorDto?> Handle(GetMajstorByIdQuery request, CancellationToken cancellationToken)
        {
            var majstor = await _context.Majstori
                .Include(m => m.Korisnik)
                .Where(m => m.KorisnikId == request.KorisnikId)
                .Select(m => new MajstorDto
                {
                    KorisnikId = m.KorisnikId,
                    Ime = m.Korisnik!.Ime,
                    Prezime = m.Korisnik.Prezime,
                    Email = m.Korisnik.Email,
                    Telefon = m.Korisnik.Telefon,
                    Grad = m.Korisnik.Grad ?? "",
                    Specijalizacija = m.Specijalizacija,
                    GodineIskustva = m.GodineIskustva,
                    ProsjecnaOcjena = m.ProsjecnaOcjena,
                    BrojZavrsenihPoslova = m.BrojZavrsenihPoslova,
                    CijenaMjesecne = m.CijenaMjesecne,
                    CijenaSat = m.CijenaMjesecne,
                    OpisProfila = m.DetaljanOpisProfila,
                    DatumRegistracije = m.Korisnik.DatumRegistracije
                })
                .FirstOrDefaultAsync(cancellationToken);

            return majstor;
        }
    }
}
