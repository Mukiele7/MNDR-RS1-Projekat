using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MNDR.Application.Modules.Majstori.Commands.Create;
using MNDR.Application.Modules.Majstori.Commands.Update;
using MNDR.Application.Modules.Majstori.Commands.Delete;
using MNDR.Application.Modules.Majstori.Queries.GetById;
using MNDR.Application.Modules.Majstori.Queries.List;

namespace MNDR.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MajstorController(ISender sender) : ControllerBase
    {
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<PagedMajstoriResult>> GetMajstori([FromQuery] ListMajstoriQuery query, CancellationToken ct)
        {
            var result = await sender.Send(query, ct);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<GetMajstorByIdQueryDto>> GetMajstorById(int id, CancellationToken ct)
        {
            var query = new GetMajstorByIdQuery { KorisnikId = id };
            var result = await sender.Send(query, ct);

            if (result == null)
                return NotFound(new { Message = "Majstor nije pronađen" });

            return Ok(result);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> CreateMajstor([FromBody] CreateMajstorCommand command, CancellationToken ct)
        {
            var result = await sender.Send(command, ct);
            if (result.Success)
                return CreatedAtAction(nameof(GetMajstorById), new { id = result.MajstorId }, result);
            return BadRequest(result);
        }

        [HttpPut("{id}")]
        [AllowAnonymous] // Privremeno za testiranje
        public async Task<IActionResult> UpdateMajstor(int id, [FromBody] UpdateMajstorCommand command, CancellationToken ct)
        {
            command.KorisnikId = id;
            var result = await sender.Send(command, ct);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        [HttpDelete("{id}")]
        [AllowAnonymous] // Privremeno za testiranje
        public async Task<IActionResult> DeleteMajstor(int id, CancellationToken ct)
        {
            var result = await sender.Send(new DeleteMajstorCommand { KorisnikId = id }, ct);
            return result.Success ? Ok(result) : BadRequest(result);
        }
    }
}

