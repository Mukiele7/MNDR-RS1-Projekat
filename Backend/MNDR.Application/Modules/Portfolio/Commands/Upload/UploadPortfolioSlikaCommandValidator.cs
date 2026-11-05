using FluentValidation;
using MNDR.Application.Commands;

namespace MNDR.Application.Modules.Portfolio.Commands.Upload;

public sealed class UploadPortfolioSlikaCommandValidator : AbstractValidator<UploadPortfolioSlikaCommand>
{
    public UploadPortfolioSlikaCommandValidator()
    {
        RuleFor(command => command.MajstorId)
            .GreaterThan(0);

        RuleFor(command => command)
            .Must(command => command.Slika is not null || !string.IsNullOrWhiteSpace(command.SlikaUrl))
            .WithMessage("Slika ili URL slike je obavezan");

        RuleFor(command => command.Slika)
            .Must(file => file is null || file.Length <= 5 * 1024 * 1024)
            .WithMessage("Maksimalna veličina slike je 5 MB");
    }
}
