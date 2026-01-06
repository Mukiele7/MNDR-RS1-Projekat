using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MNDR.Application.Modules.Kupci.Commands.Create;
using MNDR.Domain.Entities;
using MNDR.Infrastructure.Data;
using Xunit;

namespace MNDR.Tests.Handlers;

public class CreateKupacCommandHandlerTests : IDisposable
{
    private readonly MndrDbContext _context;
    private readonly CreateKupacCommandHandler _handler;
    private readonly IPasswordHasher<Korisnik> _passwordHasher;

    public CreateKupacCommandHandlerTests()
    {
        var options = new DbContextOptionsBuilder<MndrDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new MndrDbContext(options);
        _passwordHasher = new PasswordHasher<Korisnik>();
        _handler = new CreateKupacCommandHandler(_context, _passwordHasher);
    }

    [Fact]
    public async Task Handle_Should_Create_Kupac_Successfully()
    {
        // Arrange
        var command = new CreateKupacCommand
        {
            Ime = "Novi",
            Prezime = "Kupac",
            Email = "novi@test.com",
            Telefon = "061234567",
            Lozinka = "password123",
            Grad = "Sarajevo",
            Opcina = "Centar"
        };

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().BeGreaterThan(0);
        
        var korisnik = await _context.Korisnici.FirstOrDefaultAsync(k => k.Email == "novi@test.com");
        korisnik.Should().NotBeNull();
        korisnik!.Uloga.Should().Be("Kupac");

        var kupac = await _context.Kupci.FindAsync(result);
        kupac.Should().NotBeNull();
        kupac!.BrojNarudzbi.Should().Be(0);
        kupac.OcjenaPouzdanosti.Should().Be(0);
    }

    [Fact]
    public async Task Handle_Should_Throw_When_Email_Already_Exists()
    {
        // Arrange
        _context.Korisnici.Add(new Korisnik
        {
            Email = "existing@test.com",
            Ime = "Existing",
            Prezime = "User",
            Telefon = "061111111",
            Uloga = "Kupac",
            DatumRegistracije = DateTime.UtcNow
        });
        await _context.SaveChangesAsync();

        var command = new CreateKupacCommand
        {
            Ime = "Novi",
            Prezime = "Kupac",
            Email = "existing@test.com",
            Telefon = "062222222",
            Lozinka = "password123"
        };

        // Act & Assert
        await Assert.ThrowsAsync<FluentValidation.ValidationException>(
            () => _handler.Handle(command, CancellationToken.None));
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
