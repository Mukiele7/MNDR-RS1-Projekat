using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MNDR.Application.Modules.Krediti.Commands.Add;
using MNDR.Application.Modules.Krediti.Commands.Use;
using MNDR.Application.Modules.Krediti.Queries.GetKrediti;
using System.Security.Claims;

namespace MNDR.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class KreditController : ControllerBase
    {
        private readonly IMediator _mediator;

        public KreditController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("korisnik/{korisnikId}")]
        public async Task<IActionResult> GetKrediti(int korisnikId)
        {
            if (!User.IsInRole("Administrator") &&
                User.FindFirstValue(ClaimTypes.NameIdentifier) != korisnikId.ToString())
                return Forbid();

            var query = new GetKrediteQuery { KorisnikId = korisnikId };
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddKredit([FromBody] AddKreditCommand command)
        {
            if (!User.IsInRole("Administrator") &&
                User.FindFirstValue(ClaimTypes.NameIdentifier) != command.MajstorId.ToString())
                return Forbid();

            if (command.Iznos <= 0)
                return BadRequest(new { message = "Iznos mora biti veći od nule." });

            var result = await _mediator.Send(command);
            if (!result.Success)
                return BadRequest(result);

            return CreatedAtAction(nameof(GetKrediti), new { korisnikId = command.MajstorId }, result);
        }

        [HttpPost("use")]
        public async Task<IActionResult> UseKredit([FromBody] UseKreditCommand command)
        {
            if (!User.IsInRole("Administrator") &&
                User.FindFirstValue(ClaimTypes.NameIdentifier) != command.KorisnikId.ToString())
                return Forbid();

            if (command.Kolicina <= 0)
                return BadRequest(new { message = "Količina mora biti veća od nule." });

            var result = await _mediator.Send(command);
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }
    }
}
