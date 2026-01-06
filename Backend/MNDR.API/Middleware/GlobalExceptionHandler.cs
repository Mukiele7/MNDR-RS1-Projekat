using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using MNDR.Application.Common.Exceptions;
using System.Text.Json;

namespace MNDR.API.Middleware;

/// <summary>
/// Global exception handler koji hvata sve exception-e i vraća odgovarajući HTTP status kod.
/// Ovo omogućava da handleri bacaju exception-e umesto da vraćaju Success=false objekte.
/// </summary>
public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "Greška: {Message}", exception.Message);

        var (statusCode, title, errors) = MapException(exception);

        httpContext.Response.StatusCode = statusCode;
        httpContext.Response.ContentType = "application/json";

        var problemDetails = new
        {
            title,
            status = statusCode,
            errors
        };

        var json = JsonSerializer.Serialize(problemDetails);
        await httpContext.Response.WriteAsync(json, cancellationToken);

        return true; // Exception je obrađen
    }

    private static (int StatusCode, string Title, object? Errors) MapException(Exception exception)
    {
        return exception switch
        {
            MndrNotFoundException => (404, "Not Found", new { message = exception.Message }),
            
            MndrConflictException => (409, "Conflict", new { message = exception.Message }),
            
            MndrForbiddenException => (403, "Forbidden", new { message = exception.Message }),
            
            ValidationException validationEx => (400, "Validation Failed", 
                new { errors = validationEx.Errors.Select(e => new { 
                    field = e.PropertyName, 
                    message = e.ErrorMessage 
                }) }),
            
            _ => (500, "Internal Server Error", new { message = "Došlo je do greške na serveru." })
        };
    }
}
