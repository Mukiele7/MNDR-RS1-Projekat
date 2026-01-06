using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using MNDR.Application.Handlers.QueryHandlers;
using MNDR.Application.Queries;
using MNDR.Domain.Entities;
using MNDR.Infrastructure.Data;
using Xunit;

namespace MNDR.Tests.Handlers
{
    public class GetMajstoriQueryHandlerTests
    {
        private readonly MndrDbContext _context;
        private readonly GetMajstoriQueryHandler _handler;

        public GetMajstoriQueryHandlerTests()
        {
            // Setup in-memory database
            var options = new DbContextOptionsBuilder<MndrDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new MndrDbContext(options);
            _handler = new GetMajstoriQueryHandler(_context);

            // Seed test data
            SeedTestData();
        }

        private void SeedTestData()
        {
            var korisnici = new List<Korisnik>
            {
                new Korisnik { KorisnikId = 1, Ime = "Marko", Prezime = "Markovic", Email = "marko@test.com", Telefon = "061111111", Grad = "Sarajevo" },
                new Korisnik { KorisnikId = 2, Ime = "Petar", Prezime = "Petrovic", Email = "petar@test.com", Telefon = "062222222", Grad = "Banja Luka" },
                new Korisnik { KorisnikId = 3, Ime = "Jovan", Prezime = "Jovanovic", Email = "jovan@test.com", Telefon = "063333333", Grad = "Sarajevo" }
            };

            var majstori = new List<Majstor>
            {
                new Majstor 
                { 
                    KorisnikId = 1, 
                    Specijalizacija = "Vodoinstalater", 
                    GodineIskustva = 10, 
                    CijenaMjesecne = 2000, 
                    ProsjecnaOcjena = 4.5m,
                    DetaljanOpisProfila = "Iskusan vodoinstalater"
                },
                new Majstor 
                { 
                    KorisnikId = 2, 
                    Specijalizacija = "Električar", 
                    GodineIskustva = 5, 
                    CijenaMjesecne = 1500, 
                    ProsjecnaOcjena = 4.0m,
                    DetaljanOpisProfila = "Električar sa iskustvom"
                },
                new Majstor 
                { 
                    KorisnikId = 3, 
                    Specijalizacija = "Keramičar", 
                    GodineIskustva = 15, 
                    CijenaMjesecne = 2500, 
                    ProsjecnaOcjena = 4.8m,
                    DetaljanOpisProfila = "Profesionalni keramičar"
                }
            };

            _context.Korisnici.AddRange(korisnici);
            _context.Majstori.AddRange(majstori);
            _context.SaveChanges();
        }

        [Fact]
        public async Task Should_Return_All_Majstori_When_No_Filters_Applied()
        {
            // Arrange
            var query = new GetMajstoriQuery
            {
                PageNumber = 1,
                PageSize = 10
            };

            // Act
            var result = await _handler.Handle(query, CancellationToken.None);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(3);
            result.TotalCount.Should().Be(3);
        }

        [Fact]
        public async Task Should_Filter_By_Specijalizacija()
        {
            // Arrange
            var query = new GetMajstoriQuery
            {
                PageNumber = 1,
                PageSize = 10,
                Specijalizacija = "Vodoinstalater"
            };

            // Act
            var result = await _handler.Handle(query, CancellationToken.None);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(1);
            result.Items.First().Specijalizacija.Should().Contain("Vodoinstalater");
            result.TotalCount.Should().Be(1);
        }

        [Fact]
        public async Task Should_Filter_By_MinOcjena()
        {
            // Arrange
            var query = new GetMajstoriQuery
            {
                PageNumber = 1,
                PageSize = 10,
                MinOcjena = 4.5m
            };

            // Act
            var result = await _handler.Handle(query, CancellationToken.None);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(2); // Vodoinstalater (4.5) i Keramičar (4.8)
            result.Items.Should().AllSatisfy(m => m.ProsjecnaOcjena.Should().BeGreaterThanOrEqualTo(4.5m));
        }

        [Fact]
        public async Task Should_Filter_By_Grad()
        {
            // Arrange
            var query = new GetMajstoriQuery
            {
                PageNumber = 1,
                PageSize = 10,
                Grad = "Sarajevo"
            };

            // Act
            var result = await _handler.Handle(query, CancellationToken.None);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(2); // Marko i Jovan iz Sarajeva
            result.Items.Should().AllSatisfy(m => m.Grad.Should().Be("Sarajevo"));
        }

        [Fact]
        public async Task Should_Filter_By_MinGodineIskustva()
        {
            // Arrange
            var query = new GetMajstoriQuery
            {
                PageNumber = 1,
                PageSize = 10,
                MinGodineIskustva = 10
            };

            // Act
            var result = await _handler.Handle(query, CancellationToken.None);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(2); // Vodoinstalater (10) i Keramičar (15)
            result.Items.Should().AllSatisfy(m => m.GodineIskustva.Should().BeGreaterThanOrEqualTo(10));
        }

        [Fact]
        public async Task Should_Filter_By_MaxCijena()
        {
            // Arrange
            var query = new GetMajstoriQuery
            {
                PageNumber = 1,
                PageSize = 10,
                MaxCijena = 2000
            };

            // Act
            var result = await _handler.Handle(query, CancellationToken.None);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(2); // Vodoinstalater (2000) i Električar (1500)
            result.Items.Should().AllSatisfy(m => m.CijenaSat.Should().BeLessThanOrEqualTo(2000));
        }

        [Fact]
        public async Task Should_Apply_Multiple_Filters()
        {
            // Arrange
            var query = new GetMajstoriQuery
            {
                PageNumber = 1,
                PageSize = 10,
                Grad = "Sarajevo",
                MinGodineIskustva = 10
            };

            // Act
            var result = await _handler.Handle(query, CancellationToken.None);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(2); // Vodoinstalater i Keramičar iz Sarajeva sa 10+ god
        }

        [Fact]
        public async Task Should_Paginate_Results()
        {
            // Arrange
            var query = new GetMajstoriQuery
            {
                PageNumber = 1,
                PageSize = 2
            };

            // Act
            var result = await _handler.Handle(query, CancellationToken.None);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(2);
            result.TotalCount.Should().Be(3);
        }

        [Fact]
        public async Task Should_Return_Empty_When_No_Results_Match_Filters()
        {
            // Arrange
            var query = new GetMajstoriQuery
            {
                PageNumber = 1,
                PageSize = 10,
                Specijalizacija = "Nepostojeća specijalizacija"
            };

            // Act
            var result = await _handler.Handle(query, CancellationToken.None);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().BeEmpty();
            result.TotalCount.Should().Be(0);
        }
    }
}
