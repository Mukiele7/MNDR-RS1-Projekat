using FluentValidation.TestHelper;
using MNDR.Application.Commands;
using MNDR.Application.Validators;
using Xunit;

namespace MNDR.Tests.Validators
{
    public class CreateMajstorCommandValidatorTests
    {
        private readonly CreateMajstorCommandValidator _validator;

        public CreateMajstorCommandValidatorTests()
        {
            _validator = new CreateMajstorCommandValidator();
        }

        [Fact]
        public void Should_Have_Error_When_Specijalizacija_Is_Empty()
        {
            // Arrange
            var command = new CreateMajstorCommand
            {
                Specijalizacija = "",
                GodineIskustva = 5,
                CijenaMjesecne = 1000,
                DetaljanOpisProfila = "Test opis"
            };

            // Act
            var result = _validator.TestValidate(command);

            // Assert
            result.ShouldHaveValidationErrorFor(x => x.Specijalizacija);
        }

        [Fact]
        public void Should_Have_Error_When_Specijalizacija_Is_Too_Long()
        {
            // Arrange
            var command = new CreateMajstorCommand
            {
                Specijalizacija = new string('A', 101), // 101 karakter
                GodineIskustva = 5,
                CijenaMjesecne = 1000,
                DetaljanOpisProfila = "Test opis"
            };

            // Act
            var result = _validator.TestValidate(command);

            // Assert
            result.ShouldHaveValidationErrorFor(x => x.Specijalizacija);
        }

        [Fact]
        public void Should_Have_Error_When_GodineIskustva_Is_Negative()
        {
            // Arrange
            var command = new CreateMajstorCommand
            {
                Specijalizacija = "Vodoinstalater",
                GodineIskustva = -1,
                CijenaMjesecne = 1000,
                DetaljanOpisProfila = "Test opis"
            };

            // Act
            var result = _validator.TestValidate(command);

            // Assert
            result.ShouldHaveValidationErrorFor(x => x.GodineIskustva);
        }

        [Fact]
        public void Should_Have_Error_When_GodineIskustva_Exceeds_50()
        {
            // Arrange
            var command = new CreateMajstorCommand
            {
                Specijalizacija = "Vodoinstalater",
                GodineIskustva = 51,
                CijenaMjesecne = 1000,
                DetaljanOpisProfila = "Test opis"
            };

            // Act
            var result = _validator.TestValidate(command);

            // Assert
            result.ShouldHaveValidationErrorFor(x => x.GodineIskustva);
        }

        [Fact]
        public void Should_Have_Error_When_CijenaMjesecne_Is_Zero()
        {
            // Arrange
            var command = new CreateMajstorCommand
            {
                Specijalizacija = "Vodoinstalater",
                GodineIskustva = 5,
                CijenaMjesecne = 0,
                DetaljanOpisProfila = "Test opis"
            };

            // Act
            var result = _validator.TestValidate(command);

            // Assert
            result.ShouldHaveValidationErrorFor(x => x.CijenaMjesecne);
        }

        [Fact]
        public void Should_Have_Error_When_CijenaMjesecne_Exceeds_100000()
        {
            // Arrange
            var command = new CreateMajstorCommand
            {
                Specijalizacija = "Vodoinstalater",
                GodineIskustva = 5,
                CijenaMjesecne = 100001,
                DetaljanOpisProfila = "Test opis"
            };

            // Act
            var result = _validator.TestValidate(command);

            // Assert
            result.ShouldHaveValidationErrorFor(x => x.CijenaMjesecne);
        }

        [Fact]
        public void Should_Have_Error_When_DetaljanOpisProfila_Is_Too_Long()
        {
            // Arrange
            var command = new CreateMajstorCommand
            {
                Specijalizacija = "Vodoinstalater",
                GodineIskustva = 5,
                CijenaMjesecne = 1000,
                DetaljanOpisProfila = new string('A', 501) // 501 karakter
            };

            // Act
            var result = _validator.TestValidate(command);

            // Assert
            result.ShouldHaveValidationErrorFor(x => x.DetaljanOpisProfila);
        }

        [Fact]
        public void Should_Not_Have_Error_When_All_Fields_Are_Valid()
        {
            // Arrange
            var command = new CreateMajstorCommand
            {
                Specijalizacija = "Vodoinstalater",
                GodineIskustva = 5,
                CijenaMjesecne = 1000,
                DetaljanOpisProfila = "Iskusan vodoinstalater sa 5 godina iskustva."
            };

            // Act
            var result = _validator.TestValidate(command);

            // Assert
            result.ShouldNotHaveAnyValidationErrors();
        }
    }
}
