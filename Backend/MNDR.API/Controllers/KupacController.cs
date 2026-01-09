using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MNDR.Application.Modules.Kupci.Commands.Create;
using MNDR.Application.Modules.Kupci.Commands.Update;
using MNDR.Application.Modules.Kupci.Commands.Delete;
using MNDR.Application.Modules.Kupci.Queries.GetById;
using MNDR.Application.Modules.Kupci.Queries.List;
using MNDR.API.Attributes;

namespace MNDR.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KupacController(ISender sender) : ControllerBase
    {
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<PagedKupciResult>> GetKupci([FromQuery] ListKupciQuery query, CancellationToken ct)
        {
            var result = await sender.Send(query, ct);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<GetKupacByIdQueryDto>> GetKupacById(int id, CancellationToken ct)
        {
            var query = new GetKupacByIdQuery { KorisnikId = id };
            var result = await sender.Send(query, ct);

            if (result == null)
                return NotFound(new { Message = "Kupac nije pronađen" });

            return Ok(result);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<int>> CreateKupac([FromForm] CreateKupacCommand command, CancellationToken ct)
        {
            int id = await sender.Send(command, ct);
            return CreatedAtAction(nameof(GetKupacById), new { id }, new { id });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Kupac,Administrator")]
        public async Task Update(int id, [FromBody] UpdateKupacCommand command, CancellationToken ct)
        {
            command.KorisnikId = id;
            await sender.Send(command, ct);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Kupac,Administrator")]
        public async Task Delete(int id, CancellationToken ct)
        {
            await sender.Send(new DeleteKupacCommand { KorisnikId = id }, ct);
        }
    }
}

