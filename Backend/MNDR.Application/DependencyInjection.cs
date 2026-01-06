using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using MNDR.Application.Common.Behaviors;
using System.Reflection;

namespace MNDR.Application;

/// <summary>
/// Extension metoda za registraciju Application layer servisa.
/// Ovo je Clean Architecture best practice - svaki layer registruje svoje servise.
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = Assembly.GetExecutingAssembly();

        // MediatR - CQRS pattern (Commands i Queries)
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(assembly));

        // FluentValidation - validatori za Commands/Queries
        services.AddValidatorsFromAssembly(assembly);

        // Pipeline Behaviors - automatska validacija
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

        return services;
    }
}
