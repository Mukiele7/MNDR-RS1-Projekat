using MNDR.Application.Modules.Auth.Commands.Login;
using MNDR.Application.Modules.Auth.Commands.Logout;
using MNDR.Application.Modules.Auth.Commands.RefreshToken;
using MNDR.Application.Modules.Auth.Commands.Register;
using MNDR.API.Attributes;
using Microsoft.AspNetCore.Authorization;

namespace MNDR.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    [ValidateRecaptcha]
    public async Task<ActionResult<RegisterCommandDto>> Register([FromBody] RegisterCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginCommandDto>> Login([FromBody] LoginCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("logout")]
    [AllowAnonymous]
    public async Task<ActionResult<LogoutCommandDto>> Logout([FromBody] LogoutCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Obnavljanje access tokena koristeći refresh token.
    /// Kada access token istekne, korisnik šalje refresh token i dobija novi par tokena.
    /// </summary>
    [HttpPost("refresh-token")]
    public async Task<ActionResult<RefreshTokenCommandDto>> RefreshToken([FromBody] RefreshTokenCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}
