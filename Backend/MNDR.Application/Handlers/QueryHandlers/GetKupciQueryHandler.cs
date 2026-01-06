using MediatR;
using Microsoft.EntityFrameworkCore;
using MNDR.Application.Abstractions;
using MNDR.Application.DTOs;
using MNDR.Application.Queries;

namespace MNDR.Application.Handlers.QueryHandlers
{
    public class GetKupciQueryHandler : IRequestHandler<GetKupciQuery, PagedKupciResult>
    {
        private readonly IAppDbContext _context;

        public GetKupciQueryHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedKupciResult> Handle(GetKupciQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Kupci
                .Include(k => k.Korisnik)
                .Where(k => k.Korisnik != null)
                .AsQueryable();

            // Filter 1: Grad
            if (!string.IsNullOrEmpty(request.Grad))
                query = query.Where(k => k.Korisnik!.Grad == request.Grad);

            // Filter 2: Općina
            if (!string.IsNullOrEmpty(request.Opcina))
                query = query.Where(k => k.Korisnik!.Opcina == request.Opcina);

            // Filter 3: Search term (ime ili prezime)
            if (!string.IsNullOrEmpty(request.SearchTerm))
                query = query.Where(k => 
                    k.Korisnik!.Ime.Contains(request.SearchTerm) || 
                    k.Korisnik.Prezime.Contains(request.SearchTerm));

            // Filter 4: MinOcjena
            if (request.MinOcjena.HasValue)
                query = query.Where(k => k.OcjenaPouzdanosti >= request.MinOcjena.Value);

            // Filter 5: MinBrojNarudzbi
            if (request.MinBrojNarudzbi.HasValue)
                query = query.Where(k => k.BrojNarudzbi >= request.MinBrojNarudzbi.Value);

            var totalCount = await query.CountAsync(cancellationToken);

            var items = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(k => new KorisnikDto
                {
                    KorisnikId = k.KorisnikId,
                    Ime = k.Korisnik!.Ime,
                    Prezime = k.Korisnik.Prezime,
                    Email = k.Korisnik.Email,
                    Telefon = k.Korisnik.Telefon,
                    Grad = k.Korisnik.Grad,
                    Opcina = k.Korisnik.Opcina,
                    Uloga = k.Korisnik.Uloga,
                    OpisProfila = k.Korisnik.OpisProfila,
                    SlikaProfila = k.Korisnik.SlikaProfila,
                    DatumRegistracije = k.Korisnik.DatumRegistracije
                })
                .ToListAsync(cancellationToken);

            return new PagedKupciResult
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };
        }
    }

    public class GetKupacByIdQueryHandler : IRequestHandler<GetKupacByIdQuery, KorisnikDto?>
    {
        private readonly IAppDbContext _context;

        public GetKupacByIdQueryHandler(IAppDbContext context)
        {
            _context = context;
        }

        public async Task<KorisnikDto?> Handle(GetKupacByIdQuery request, CancellationToken cancellationToken)
        {
            var kupac = await _context.Kupci
                .Include(k => k.Korisnik)
                .Where(k => k.KorisnikId == request.KorisnikId)
                .Select(k => new KorisnikDto
                {
                    KorisnikId = k.KorisnikId,
                    Ime = k.Korisnik!.Ime,
                    Prezime = k.Korisnik.Prezime,
                    Email = k.Korisnik.Email,
                    Telefon = k.Korisnik.Telefon,
                    Grad = k.Korisnik.Grad ?? "",
                    Opcina = k.Korisnik.Opcina ?? "",
                    Uloga = k.Korisnik.Uloga,
                    OpisProfila = k.Korisnik.OpisProfila,
                    SlikaProfila = k.Korisnik.SlikaProfila,
                    DatumRegistracije = k.Korisnik.DatumRegistracije
                })
                .FirstOrDefaultAsync(cancellationToken);

            return kupac;
        }
    }
}
