using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MNDR.Application.Abstractions;
using MNDR.Application.Modules.Oglasi.Commands.Create;
using MNDR.Application.Modules.Oglasi.Queries.GetAll;

namespace MNDR.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OglasController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IAppCurrentUser _currentUser;

        public OglasController(IMediator mediator, IAppCurrentUser currentUser)
        {
            _mediator = mediator;
            _currentUser = currentUser;
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
        [Authorize(Roles = "Majstor")]
        public async Task<IActionResult> CreateOglas([FromBody] CreateOglasCommand command, CancellationToken cancellationToken)
        {
            var majstorId = _currentUser.UserId
                ?? throw new UnauthorizedAccessException("Majstor nije prijavljen.");

            command.MajstorId = majstorId;
            var result = await _mediator.Send(command, cancellationToken);
            if (!result.Success)
                return BadRequest(result);

            return CreatedAtAction(nameof(GetOglasi), new { }, result);
        }
    }
}
