using MediatR;

namespace MNDR.Application.Common;

/// <summary>
/// Bazna klasa za sve paged queries.
/// Sve queries koje vraćaju paginaciju treba da naslede ovu klasu.
/// </summary>
public abstract class BasePagedQuery<TDto> : IRequest<PageResult<TDto>>
{
    /// <summary>
    /// Broj stranice (počinje od 1).
    /// </summary>
    public int PageNumber { get; init; } = 1;

    /// <summary>
    /// Broj item-a po stranici.
    /// </summary>
    public int PageSize { get; init; } = 10;

    /// <summary>
    /// Koliko redova da preskočimo (helper property).
    /// </summary>
    public int SkipCount => (PageNumber - 1) * PageSize;
}
