using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using MNDR.Application.Modules.Kupci.Queries.List;
using MNDR.Domain.Entities;
using MNDR.Infrastructure.Data;
using Xunit;

namespace MNDR.Tests.Handlers;

public class ListKupciQueryHandlerTests : IDisposable
{
    private readonly MndrDbContext _context;
    private readonly ListKupciQueryHandler _handler;

    public ListKupciQueryHandlerTests()
    {
        var options = new DbContextOptionsBuilder<MndrDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new MndrDbContext(options);
        _handler = new ListKupciQueryHandler(_context);

        SeedTestData();
    }

    private void SeedTestData()
    {
        var korisnici = new[]
        {
            new Korisnik
            {
                KorisnikId = 1,
                Ime = "Marko",
                Prezime = "Marković",
                Email = "marko@test.com",
                Telefon = "061111111",
                Uloga = "Kupac",
                Grad = "Sarajevo",
                Opcina = "Centar",
                DatumRegistracije = DateTime.UtcNow
            },
            new Korisnik
            {
                KorisnikId = 2,
                Ime = "Ana",
                Prezime = "Anić",
                Email = "ana@test.com",
                Telefon = "062222222",
                Uloga = "Kupac",
                Grad = "Banja Luka",
                Opcina = "Borik",
                DatumRegistracije = DateTime.UtcNow
            }
        };

        var kupci = new[]
        {
            new Kupac
            {
                KorisnikId = 1,
                BrojNarudzbi = 5,
                OcjenaPouzdanosti = 4.5m
            },
            new Kupac
            {
                KorisnikId = 2,
                BrojNarudzbi = 3,
                OcjenaPouzdanosti = 4.0m
            }
        };

        _context.Korisnici.AddRange(korisnici);
        _context.Kupci.AddRange(kupci);
        _context.SaveChanges();
    }

    [Fact]
    public async Task Handle_Should_Return_All_Kupci_When_No_Filters()
    {
        // Arrange
        var query = new ListKupciQuery
        {
            PageNumber = 1,
            PageSize = 10
        };

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.TotalCount.Should().Be(2);
        result.Items.Should().HaveCount(2);
    }

    [Fact]
    public async Task Handle_Should_Filter_By_Grad()
    {
        // Arrange
        var query = new ListKupciQuery
        {
            Grad = "Sarajevo",
            PageNumber = 1,
            PageSize = 10
        };

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.TotalCount.Should().Be(1);
        result.Items.First().Ime.Should().Be("Marko");
    }

    [Fact]
    public async Task Handle_Should_Filter_By_MinOcjena()
    {
        // Arrange
        var query = new ListKupciQuery
        {
            MinOcjena = 4.3m,
            PageNumber = 1,
            PageSize = 10
        };

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.TotalCount.Should().Be(1);
        result.Items.First().Ime.Should().Be("Marko");
    }

    [Fact]
    public async Task Handle_Should_Apply_Paging()
    {
        // Arrange
        var query = new ListKupciQuery
        {
            PageNumber = 1,
            PageSize = 1
        };

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Items.Should().HaveCount(1);
        result.TotalCount.Should().Be(2);
        result.TotalPages.Should().Be(2);
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
