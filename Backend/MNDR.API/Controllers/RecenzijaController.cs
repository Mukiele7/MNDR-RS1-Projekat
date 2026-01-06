using MediatR;
using Microsoft.AspNetCore.Mvc;
using MNDR.Application.Modules.Recenzije.Commands.Create;
using MNDR.Application.Modules.Recenzije.Queries.GetRecenzije;

namespace MNDR.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecenzijaController : ControllerBase
    {
        private readonly IMediator _mediator;

        public RecenzijaController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("majstor/{majstorId}")]
        public async Task<IActionResult> GetRecenzije(int majstorId)
        {
            var query = new GetRecenzijeQuery { MajstorId = majstorId };
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateRecenzija([FromBody] CreateRecenzijaCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result.Success)
                return BadRequest(result);

            return CreatedAtAction(nameof(GetRecenzije), new { majstorId = 0 }, result);
        }
    }
}
