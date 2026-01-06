namespace MNDR.Application.Common.Exceptions;

/// <summary>
/// Exception koji se baca kada korisnik nema dozvolu za akciju.
/// Mapira se na HTTP 403 Forbidden status kod.
/// </summary>
public class MndrForbiddenException : Exception
{
    public MndrForbiddenException()
        : base("Nemate dozvolu za ovu akciju.")
    {
    }

    public MndrForbiddenException(string message)
        : base(message)
    {
    }

    public MndrForbiddenException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}
