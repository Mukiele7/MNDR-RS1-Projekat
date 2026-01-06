using MediatR;
using Microsoft.AspNetCore.Mvc;
using MNDR.Application.Modules.Oglasi.Commands.Create;
using MNDR.Application.Modules.Oglasi.Queries.GetAll;

namespace MNDR.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OglasController : ControllerBase
    {
        private readonly IMediator _mediator;

        public OglasController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> GetOglasi(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? status = null,
            [FromQuery] int? majstorId = null,
            [FromQuery] string? searchTerm = null)
        {
            var query = new GetOglasQuery
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                Status = status,
                MajstorId = majstorId,
                SearchTerm = searchTerm
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateOglas([FromBody] CreateOglasCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result.Success)
                return BadRequest(result);

            return CreatedAtAction(nameof(GetOglasi), new { }, result);
        }
    }
}
