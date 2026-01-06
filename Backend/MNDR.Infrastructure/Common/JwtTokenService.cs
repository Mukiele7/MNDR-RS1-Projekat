using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MNDR.Application.Abstractions;
using MNDR.Domain.Entities;
using MNDR.Infrastructure.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace MNDR.Infrastructure.Common;

/// <summary>
/// Implementacija IJwtTokenService interfejsa.
/// Generiše i validira JWT tokene.
/// </summary>
public class JwtTokenService : IJwtTokenService
{
    private readonly JwtOptions _jwtOptions;

    public JwtTokenService(IOptions<JwtOptions> jwtOptions)
    {
        _jwtOptions = jwtOptions.Value;
    }

    public JwtTokenPair IssueTokens(Korisnik user)
    {
        var nowUtc = DateTime.UtcNow;
        var accessExpires = nowUtc.AddMinutes(_jwtOptions.ExpiryMinutes);
        var refreshExpires = nowUtc.AddDays(_jwtOptions.RefreshTokenExpiryDays);

        // Claims za access token
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.KorisnikId.ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.KorisnikId.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, $"{user.Ime} {user.Prezime}"),
            new Claim(ClaimTypes.Role, user.Uloga),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N")),
            new Claim(JwtRegisteredClaimNames.Iat, ((DateTimeOffset)nowUtc).ToUnixTimeSeconds().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwtOptions.Issuer,
            audience: _jwtOptions.Audience,
            claims: claims,
            notBefore: nowUtc,
            expires: accessExpires,
            signingCredentials: credentials
        );

        var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

        // Generisanje refresh tokena
        var refreshRaw = GenerateRefreshTokenRaw(64);
        var refreshHash = HashRefreshToken(refreshRaw);

        return new JwtTokenPair
        {
            AccessToken = accessToken,
            AccessTokenExpiresAtUtc = accessExpires,
            RefreshTokenRaw = refreshRaw,
            RefreshTokenHash = refreshHash,
            RefreshTokenExpiresAtUtc = refreshExpires
        };
    }

    public string HashRefreshToken(string rawToken)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(rawToken));
        return Base64UrlEncoder.Encode(bytes);
    }

    public int? ValidateToken(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtOptions.Secret);

            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _jwtOptions.Issuer,
                ValidateAudience = true,
                ValidAudience = _jwtOptions.Audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;
            var userIdClaim = jwtToken.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value;

            return int.Parse(userIdClaim);
        }
        catch
        {
            return null;
        }
    }

    private static string GenerateRefreshTokenRaw(int numBytes)
    {
        var bytes = RandomNumberGenerator.GetBytes(numBytes);
        return Base64UrlEncoder.Encode(bytes);
    }
}
