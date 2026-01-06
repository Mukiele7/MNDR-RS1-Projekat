using MediatR;
using Microsoft.AspNetCore.Mvc;
using MNDR.Application.Modules.Notifikacije.Commands.Create;
using MNDR.Application.Modules.Notifikacije.Commands.MarkAsRead;
using MNDR.Application.Modules.Notifikacije.Queries.GetNotifikacije;

namespace MNDR.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotifikacijaController : ControllerBase
    {
        private readonly IMediator _mediator;

        public NotifikacijaController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("korisnik/{korisnikId}")]
        public async Task<IActionResult> GetNotifikacije(int korisnikId, [FromQuery] bool? samoNeprocitane = null)
        {
            var query = new GetNotifikacijeQuery { KorisnikId = korisnikId, SamoNeprocitane = samoNeprocitane };
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateNotifikacija([FromBody] CreateNotifikacijuCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result.Success)
                return BadRequest(result);

            return CreatedAtAction(nameof(GetNotifikacije), new { korisnikId = command.KorisnikId }, result);
        }

        [HttpPut("{notifikacijaId}/read")]
        public async Task<IActionResult> MarkAsRead(int notifikacijaId)
        {
            var command = new MarkNotifikacijuAsReadCommand { NotifikacijaId = notifikacijaId };
            var result = await _mediator.Send(command);
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }
    }
}
