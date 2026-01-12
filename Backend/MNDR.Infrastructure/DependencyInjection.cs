using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MNDR.Application.Abstractions;
using MNDR.Domain.Entities;
using MNDR.Infrastructure.Common;
using MNDR.Infrastructure.Data;
using MNDR.Infrastructure.Options;
using System.Text;

namespace MNDR.Infrastructure;

/// <summary>
/// Extension metoda za registraciju Infrastructure layer servisa.
/// Ovo je Clean Architecture best practice - svaki layer registruje svoje servise.
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // ============================================
        // 1. OPTIONS PATTERN - Strongly-typed konfiguracija
        // ============================================

        // JWT Options sa validacijom
        services.AddOptions<JwtOptions>()
            .Bind(configuration.GetSection(JwtOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        // Connection Strings Options sa validacijom
        services.AddOptions<ConnectionStringsOptions>()
            .Bind(configuration.GetSection(ConnectionStringsOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        // ============================================
        // 2. DATABASE CONTEXT
        // ============================================

        services.AddDbContext<MndrDbContext>((serviceProvider, options) =>
        {
            var connectionStrings = serviceProvider
                .GetRequiredService<IOptions<ConnectionStringsOptions>>()
                .Value;

            options.UseSqlServer(
                connectionStrings.DefaultConnection,
                sqlOptions =>
                {
                    sqlOptions.EnableRetryOnFailure(
                        maxRetryCount: 3,
                        maxRetryDelay: TimeSpan.FromSeconds(5),
                        errorNumbersToAdd: null);
                });
        });

        // Registruj IAppDbContext kao proxy za MndrDbContext
        services.AddScoped<IAppDbContext>(provider => 
            provider.GetRequiredService<MndrDbContext>());

        // ============================================
        // 3. APPLICATION SERVICES
        // ============================================

        // HttpContextAccessor - potreban za AppCurrentUser
        services.AddHttpContextAccessor();

        // Current User servis
        services.AddScoped<IAppCurrentUser, AppCurrentUser>();

        // JWT Token servis
        services.AddScoped<IJwtTokenService, JwtTokenService>();

        // Password Hasher - ASP.NET Core Identity
        services.AddScoped<IPasswordHasher<Korisnik>, PasswordHasher<Korisnik>>();

        // ============================================
        // 4. JWT AUTHENTICATION
        // ============================================

        var jwtOptions = configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>()
            ?? throw new InvalidOperationException("JWT konfiguracija nije pronađena u appsettings.json");

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtOptions.Secret)),
                ValidateIssuer = true,
                ValidIssuer = jwtOptions.Issuer,
                ValidateAudience = true,
                ValidAudience = jwtOptions.Audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero // Nema dodatnog vremena za expiraciju
            };
            
            // Podrška za SignalR - čitaj token iz query parametra
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    var accessToken = context.Request.Query["access_token"];
                    var path = context.HttpContext.Request.Path;
                    
                    // Ako je zahtev za SignalR hub i ima token u query stringu
                    if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                    {
                        context.Token = accessToken;
                    }
                    
                    return Task.CompletedTask;
                }
            };
        });

        services.AddAuthorization();

        return services;
    }
}
