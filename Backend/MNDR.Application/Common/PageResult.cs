using Microsoft.EntityFrameworkCore;

namespace MNDR.Application.Common;

/// <summary>
/// Generički result za paginaciju.
/// Sadrži listu item-a i metadata (trenutna stranica, ukupno stranica, itd.).
/// </summary>
public sealed class PageResult<T>
{
    public required IReadOnlyList<T> Items { get; init; }
    public required int PageSize { get; init; }
    public required int CurrentPage { get; init; }
    public required int TotalItems { get; init; }
    public required int TotalPages { get; init; }
    public bool HasPreviousPage => CurrentPage > 1;
    public bool HasNextPage => CurrentPage < TotalPages;

    /// <summary>
    /// Helper metoda koja kreira PageResult iz IQueryable-a.
    /// Automatski računa total items i pages.
    /// </summary>
    public static async Task<PageResult<T>> FromQueryableAsync(
        IQueryable<T> query,
        int pageNumber,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        // Prvo prebrojimo ukupan broj item-a
        var totalItems = await query.CountAsync(cancellationToken);

        // Izračunamo ukupan broj stranica
        var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        // Učitamo samo item-e za trenutnu stranicu
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PageResult<T>
        {
            Items = items,
            PageSize = pageSize,
            CurrentPage = pageNumber,
            TotalItems = totalItems,
            TotalPages = totalPages
        };
    }
}
