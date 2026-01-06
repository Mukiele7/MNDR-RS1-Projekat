namespace MNDR.Application.Common.Exceptions;

/// <summary>
/// Exception koji se baca kada traženi resurs nije pronađen.
/// Mapira se na HTTP 404 Not Found status kod.
/// </summary>
public class MndrNotFoundException : Exception
{
    public MndrNotFoundException()
        : base()
    {
    }

    public MndrNotFoundException(string message)
        : base(message)
    {
    }

    public MndrNotFoundException(string message, Exception innerException)
        : base(message, innerException)
    {
    }

    public MndrNotFoundException(string resourceName, object key)
        : base($"{resourceName} sa ključem '{key}' nije pronađen.")
    {
    }
}
