using Microsoft.AspNetCore.Authorization;
using MNDR.Application.Abstractions;
using MNDR.Application.Modules.Admin;

namespace MNDR.API.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Administrator")]
public sealed class AdminController(IAdminService adminService, IAppCurrentUser currentUser) : ControllerBase
{
    [HttpGet("overview")]
    public async Task<ActionResult<AdminOverviewResponse>> GetOverview(CancellationToken cancellationToken)
        => Ok(await adminService.GetOverviewAsync(cancellationToken));

    [HttpGet("users")]
    public async Task<ActionResult<IReadOnlyList<AdminUserResponse>>> GetUsers(
        [FromQuery] string? search,
        CancellationToken cancellationToken)
        => Ok(await adminService.GetUsersAsync(search, cancellationToken));

    [HttpGet("listings")]
    public async Task<ActionResult<IReadOnlyList<AdminListingResponse>>> GetListings(CancellationToken cancellationToken)
        => Ok(await adminService.GetListingsAsync(cancellationToken));

    [HttpGet("reviews")]
    public async Task<ActionResult<IReadOnlyList<AdminReviewResponse>>> GetReviews(CancellationToken cancellationToken)
        => Ok(await adminService.GetReviewsAsync(cancellationToken));

    [HttpPatch("listings/{id}/status")]
    public async Task<IActionResult> UpdateListingStatus(
        int id,
        [FromBody] UpdateListingStatusRequest request,
        CancellationToken cancellationToken)
    {
        await adminService.UpdateListingStatusAsync(id, request.Status, cancellationToken);
        return NoContent();
    }

    [HttpPatch("users/{id}/role")]
    public async Task<IActionResult> UpdateUserRole(
        int id,
        [FromBody] UpdateUserRoleRequest request,
        CancellationToken cancellationToken)
    {
        await adminService.UpdateUserRoleAsync(id, request.Uloga, cancellationToken);
        return NoContent();
    }

    [HttpDelete("reviews/{id}")]
    public async Task<IActionResult> DeleteReview(int id, CancellationToken cancellationToken)
    {
        await adminService.DeleteReviewAsync(id, cancellationToken);
        return NoContent();
    }

    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(int id, CancellationToken cancellationToken)
    {
        var currentUserId = currentUser.UserId
            ?? throw new UnauthorizedAccessException("Korisnik nije prijavljen.");

        await adminService.DeleteUserAsync(id, currentUserId, cancellationToken);
        return NoContent();
    }

}
