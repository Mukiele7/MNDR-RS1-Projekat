using MediatR;
using Microsoft.AspNetCore.Mvc;
using MNDR.Application.Modules.Razgovori.Commands.Create;
using MNDR.Application.Modules.Razgovori.Commands.SendPoruka;
using MNDR.Application.Modules.Razgovori.Queries.GetById;
using MNDR.Application.Modules.Razgovori.Queries.GetUserRazgovori;

namespace MNDR.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RazgovorController : ControllerBase
    {
        private readonly IMediator _mediator;

        public RazgovorController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("user/{korisnikId}")]
        public async Task<IActionResult> GetUserRazgovori(int korisnikId)
        {
            var query = new GetUserRazgovoriQuery { KorisnikId = korisnikId };
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("{razgovorId}")]
        public async Task<IActionResult> GetRazgovor(int razgovorId)
        {
            var query = new GetRazgovorQuery { RazgovorId = razgovorId };
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateRazgovor([FromBody] CreateRazgovorCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result.Success)
                return BadRequest(result);

            return CreatedAtAction(nameof(GetRazgovor), new { razgovorId = result.RazgovorId }, result);
        }

        [HttpPost("{razgovorId}/poruka")]
        public async Task<IActionResult> SendPoruka(int razgovorId, [FromBody] SendRazgovorPorukaCommand command)
        {
            command.RazgovorId = razgovorId;
            var result = await _mediator.Send(command);
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }
    }
}
