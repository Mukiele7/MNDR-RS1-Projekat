using MediatR;
using Microsoft.AspNetCore.Mvc;
using MNDR.Application.Modules.Krediti.Commands.Add;
using MNDR.Application.Modules.Krediti.Commands.Use;
using MNDR.Application.Modules.Krediti.Queries.GetKrediti;

namespace MNDR.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
            var query = new GetKrediteQuery { KorisnikId = korisnikId };
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddKredit([FromBody] AddKreditCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result.Success)
                return BadRequest(result);

            return CreatedAtAction(nameof(GetKrediti), new { korisnikId = command.MajstorId }, result);  // Changed from KorisnikId to MajstorId
        }

        [HttpPost("use")]
        public async Task<IActionResult> UseKredit([FromBody] UseKreditCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }
    }
}
