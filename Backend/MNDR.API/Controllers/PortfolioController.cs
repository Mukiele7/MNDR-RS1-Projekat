using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MNDR.Application.Commands;
using MNDR.Application.Queries;

namespace MNDR.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PortfolioController : ControllerBase
{
    private readonly ISender _sender;

    public PortfolioController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Dohvati sve portfolio slike za majstora
    /// </summary>
    [HttpGet("majstor/{majstorId}")]
    [AllowAnonymous]
    public async Task<ActionResult<GetPortfolioSlikeResponse>> GetPortfolioSlike(int majstorId, CancellationToken ct)
    {
        var query = new GetPortfolioSlikeQuery { MajstorId = majstorId };
        var result = await _sender.Send(query, ct);

        if (!result.Success)
            return NotFound(result);

        return Ok(result);
    }

    /// <summary>
    /// Upload nova portfolio slika
    /// </summary>
    [HttpPost]
    [Authorize] // Samo ulogovani korisnici
    public async Task<ActionResult<UploadPortfolioSlikaResponse>> UploadPortfolioSlika([FromBody] UploadPortfolioSlikaCommand command, CancellationToken ct)
    {
        var result = await _sender.Send(command, ct);

        if (!result.Success)
            return BadRequest(result);

        return CreatedAtAction(nameof(GetPortfolioSlike), new { majstorId = command.MajstorId }, result);
    }

    /// <summary>
    /// Obriši portfolio sliku (samo vlasnik)
    /// </summary>
    [HttpDelete("{portfolioSlikaId}")]
    [Authorize] // Samo ulogovani korisnici
    public async Task<ActionResult<DeletePortfolioSlikaResponse>> DeletePortfolioSlika(int portfolioSlikaId, [FromQuery] int majstorId, CancellationToken ct)
    {
        var command = new DeletePortfolioSlikaCommand
        {
            PortfolioSlikaId = portfolioSlikaId,
            MajstorId = majstorId
        };

        var result = await _sender.Send(command, ct);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    /// <summary>
    /// Postavi/ukloni sliku kao istaknutu (max 3)
    /// </summary>
    [HttpPut("set-featured")]
    [Authorize]
    public async Task<ActionResult<SetFeaturedSlikaResponse>> SetFeaturedSlika([FromBody] SetFeaturedSlikaCommand command, CancellationToken ct)
    {
        var result = await _sender.Send(command, ct);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }
}

