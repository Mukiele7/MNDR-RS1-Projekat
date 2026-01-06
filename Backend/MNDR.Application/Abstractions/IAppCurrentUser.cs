namespace MNDR.Application.Abstractions;

/// <summary>
/// Servis koji pruža informacije o trenutno ulogovanom korisniku.
/// Učitava podatke iz JWT tokena (claims) koji dolazi sa request-om.
/// </summary>
public interface IAppCurrentUser
{
    /// <summary>
    /// ID trenutno ulogovanog korisnika.
    /// Null ako korisnik nije autentifikovan.
    /// </summary>
    int? UserId { get; }

    /// <summary>
    /// Email trenutno ulogovanog korisnika.
    /// Null ako korisnik nije autentifikovan.
    /// </summary>
    string? Email { get; }

    /// <summary>
    /// Uloga trenutno ulogovanog korisnika (Administrator, Majstor, Kupac).
    /// Null ako korisnik nije autentifikovan.
    /// </summary>
    string? Role { get; }

    /// <summary>
    /// Da li je korisnik autentifikovan.
    /// </summary>
    bool IsAuthenticated { get; }

    /// <summary>
    /// Puno ime korisnika (Ime + Prezime).
    /// </summary>
    string? FullName { get; }
}
