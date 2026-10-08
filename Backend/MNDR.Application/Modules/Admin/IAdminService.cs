namespace MNDR.Application.Modules.Admin;

public interface IAdminService
{
    Task<AdminOverviewResponse> GetOverviewAsync(CancellationToken cancellationToken);
    Task<IReadOnlyList<AdminUserResponse>> GetUsersAsync(string? search, CancellationToken cancellationToken);
    Task<IReadOnlyList<AdminListingResponse>> GetListingsAsync(CancellationToken cancellationToken);
    Task<IReadOnlyList<AdminReviewResponse>> GetReviewsAsync(CancellationToken cancellationToken);
    Task UpdateListingStatusAsync(int oglasId, string status, CancellationToken cancellationToken);
    Task UpdateUserRoleAsync(int korisnikId, string role, CancellationToken cancellationToken);
    Task DeleteReviewAsync(int recenzijaId, CancellationToken cancellationToken);
    Task DeleteUserAsync(int korisnikId, int currentUserId, CancellationToken cancellationToken);
}
