using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MNDR.Application.Modules.Favorites.Commands.Add;
using MNDR.Application.Modules.Favorites.Commands.Remove;
using MNDR.Application.Modules.Favorites.Queries.GetFavorites;
using MNDR.Application.Modules.Favorites.Queries.IsFavorite;
using MNDR.Application.Abstractions;

namespace MNDR.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FavoritesController(ISender sender, IAppCurrentUser currentUser) : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = "Kupac")]
    public async Task<ActionResult<bool>> AddFavorite([FromBody] AddFavoriteCommand command, CancellationToken ct)
    {
        command.KupacId = currentUser.UserId
            ?? throw new UnauthorizedAccessException("Kupac nije prijavljen.");
        var result = await sender.Send(command, ct);
        return Ok(result);
    }

    [HttpDelete]
    [Authorize(Roles = "Kupac")]
    public async Task<ActionResult<bool>> RemoveFavorite([FromQuery] int kupacId, [FromQuery] int majstorId, CancellationToken ct)
    {
        var command = new RemoveFavoriteCommand
        {
            KupacId = currentUser.UserId
                ?? throw new UnauthorizedAccessException("Kupac nije prijavljen."),
            MajstorId = majstorId
        };
        var result = await sender.Send(command, ct);
        return Ok(result);
    }

    [HttpGet]
    [Authorize(Roles = "Kupac")]
    public async Task<ActionResult<GetFavoritesResult>> GetFavorites([FromQuery] GetFavoritesQuery query, CancellationToken ct)
    {
        query.KupacId = currentUser.UserId
            ?? throw new UnauthorizedAccessException("Kupac nije prijavljen.");
        var result = await sender.Send(query, ct);
        return Ok(result);
    }

    [HttpGet("is-favorite")]
    [Authorize(Roles = "Kupac")]
    public async Task<ActionResult<bool>> IsFavorite([FromQuery] int kupacId, [FromQuery] int majstorId, CancellationToken ct)
    {
        var query = new IsFavoriteQuery
        {
            KupacId = currentUser.UserId
                ?? throw new UnauthorizedAccessException("Kupac nije prijavljen."),
            MajstorId = majstorId
        };
        var result = await sender.Send(query, ct);
        return Ok(result);
    }
}
