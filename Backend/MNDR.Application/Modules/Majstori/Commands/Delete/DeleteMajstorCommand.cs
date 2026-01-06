namespace MNDR.Application.Modules.Majstori.Commands.Delete;

public class DeleteMajstorCommand : IRequest<DeleteMajstorResponse>
{
    public int KorisnikId { get; set; }
}

public class DeleteMajstorResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}
