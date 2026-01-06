using FluentValidation;
using MediatR;

namespace MNDR.Application.Common.Behaviors;

/// <summary>
/// MediatR Pipeline Behavior koji automatski validira sve Commands/Queries.
/// Ako validacija ne uspe, baca ValidationException PRE nego što request stigne do Handler-a.
/// </summary>
public sealed class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        // Ako nema validatora, samo nastavi ka Handler-u
        if (!_validators.Any())
        {
            return await next();
        }

        // Kreiraj validation context
        var context = new ValidationContext<TRequest>(request);

        // Pokreni sve validatore paralelno
        var validationResults = await Task.WhenAll(
            _validators.Select(v => v.ValidateAsync(context, cancellationToken)));

        // Sakupi sve greške
        var failures = validationResults
            .SelectMany(r => r.Errors)
            .Where(f => f != null)
            .ToList();

        // Ako ima grešaka, baci exception
        if (failures.Count != 0)
        {
            throw new ValidationException(failures);
        }

        // Ako je sve validno, nastavi ka Handler-u
        return await next();
    }
}
