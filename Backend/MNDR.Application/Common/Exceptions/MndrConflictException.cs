namespace MNDR.Application.Common.Exceptions;

/// <summary>
/// Exception koji se baca kada postoji konflikt u podacima.
/// Primer: pokušaj registracije sa email-om koji već postoji.
/// Mapira se na HTTP 409 Conflict status kod.
/// </summary>
public class MndrConflictException : Exception
{
    public MndrConflictException()
        : base()
    {
    }

    public MndrConflictException(string message)
        : base(message)
    {
    }

    public MndrConflictException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}
