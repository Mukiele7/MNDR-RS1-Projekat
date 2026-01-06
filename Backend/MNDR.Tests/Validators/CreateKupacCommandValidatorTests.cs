using FluentValidation.TestHelper;
using MNDR.Application.Modules.Kupci.Commands.Create;
using Xunit;

namespace MNDR.Tests.Validators;

public class CreateKupacCommandValidatorTests
{
    private readonly CreateKupacCommandValidator _validator;

    public CreateKupacCommandValidatorTests()
    {
        _validator = new CreateKupacCommandValidator();
    }

    [Fact]
    public void Should_Have_Error_When_Ime_Is_Empty()
    {
        // Arrange
        var command = new CreateKupacCommand { Ime = "" };

        // Act
        var result = _validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Ime);
    }

    [Fact]
    public void Should_Have_Error_When_Email_Is_Invalid()
    {
        // Arrange
        var command = new CreateKupacCommand
        {
            Ime = "Marko",
            Prezime = "Marković",
            Email = "invalid-email",
            Telefon = "061234567",
            Lozinka = "password123"
        };

        // Act
        var result = _validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void Should_Not_Have_Error_When_Valid_Data()
    {
        // Arrange
        var command = new CreateKupacCommand
        {
            Ime = "Marko",
            Prezime = "Marković",
            Email = "marko@example.com",
            Telefon = "061234567",
            Lozinka = "password123",
            Grad = "Sarajevo",
            Opcina = "Centar"
        };

        // Act
        var result = _validator.TestValidate(command);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Ime);
        result.ShouldNotHaveValidationErrorFor(x => x.Prezime);
        result.ShouldNotHaveValidationErrorFor(x => x.Email);
    }

    [Theory]
    [InlineData("061234567")]
    [InlineData("+38761234567")]
    [InlineData("066123456")]
    public void Should_Not_Have_Error_When_Valid_Phone_Number(string telefon)
    {
        // Arrange
        var command = new CreateKupacCommand
        {
            Ime = "Test",
            Prezime = "User",
            Email = "test@example.com",
            Telefon = telefon,
            Lozinka = "password123"
        };

        // Act
        var result = _validator.TestValidate(command);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Telefon);
    }
}
