using Microsoft.AspNetCore.Http;
using MNDR.Application.Abstractions;
using System.Security.Claims;

namespace MNDR.Infrastructure.Common;

/// <summary>
/// Implementacija IAppCurrentUser interfejsa.
/// Čita informacije o trenutnom korisniku iz JWT claims-a.
/// </summary>
public class AppCurrentUser : IAppCurrentUser
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AppCurrentUser(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public int? UserId
    {
        get
        {
            var userIdClaim = _httpContextAccessor.HttpContext?.User?
                .FindFirst(ClaimTypes.NameIdentifier)?.Value;

            return userIdClaim != null ? int.Parse(userIdClaim) : null;
        }
    }

    public string? Email
    {
        get
        {
            return _httpContextAccessor.HttpContext?.User?
                .FindFirst(ClaimTypes.Email)?.Value;
        }
    }

    public string? Role
    {
        get
        {
            return _httpContextAccessor.HttpContext?.User?
                .FindFirst(ClaimTypes.Role)?.Value;
        }
    }

    public bool IsAuthenticated
    {
        get
        {
            return _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false;
        }
    }

    public string? FullName
    {
        get
        {
            return _httpContextAccessor.HttpContext?.User?
                .FindFirst(ClaimTypes.Name)?.Value;
        }
    }
}
