namespace MNDR.Application.Modules.Admin;

/// <summary>Sažetak sistema za administratorski dashboard.</summary>
public sealed record AdminOverviewResponse(
    int UkupnoKorisnika,
    int UkupnoMajstora,
    int UkupnoKupaca,
    int UkupnoOglasa,
    int AktivniOglasi,
    int UkupnoUgovora,
    int UkupnoRecenzija,
    int UkupnoRazgovora);

/// <summary>Podaci korisnika koje administrator može da pregleda.</summary>
public sealed record AdminUserResponse(
    int KorisnikId,
    string Ime,
    string Prezime,
    string Email,
    string Uloga,
    string? Grad,
    DateTimeOffset DatumRegistracije);

/// <summary>Podaci oglasa za moderatorski pregled.</summary>
public sealed record AdminListingResponse(
    int OglasId,
    int MajstorId,
    string Naslov,
    string Status,
    string MajstorIme,
    DateTimeOffset DatumObjave);

/// <summary>Podaci recenzije za moderatorski pregled.</summary>
public sealed record AdminReviewResponse(
    int RecenzijaId,
    int MajstorId,
    int KupacId,
    int Ocjena,
    string? Komentar,
    DateTimeOffset DatumRecenzije);

/// <summary>Zahtev za promenu statusa oglasa.</summary>
public sealed record UpdateListingStatusRequest
{
    public required string Status { get; init; }
}

/// <summary>Zahtev za promenu uloge korisnika.</summary>
public sealed record UpdateUserRoleRequest
{
    public required string Uloga { get; init; }
}
