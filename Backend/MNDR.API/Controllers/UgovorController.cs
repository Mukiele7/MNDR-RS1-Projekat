using MediatR;
using Microsoft.AspNetCore.Mvc;
using MNDR.Application.Modules.Ugovori.Commands.Create;
using MNDR.Application.Modules.Ugovori.Commands.Complete;
using MNDR.Application.Modules.Ugovori.Queries.GetUgovori;

namespace MNDR.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UgovorController : ControllerBase
    {
        private readonly IMediator _mediator;

        public UgovorController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("korisnik/{korisnikId}")]
        public async Task<IActionResult> GetUgovori(int korisnikId)
        {
            var query = new GetUgovoreQuery { KorisnikId = korisnikId };
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUgovor([FromBody] CreateUgovorCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result.Success)
                return BadRequest(result);

            return CreatedAtAction(nameof(GetUgovori), new { korisnikId = command.KupacId }, result);
        }

        [HttpPut("{ugovorId}/complete")]
        public async Task<IActionResult> CompleteUgovor(int ugovorId)
        {
            var command = new CompleteUgovorCommand { UgovorId = ugovorId };
            var result = await _mediator.Send(command);
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }
    }
}
