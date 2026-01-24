using FluentValidation;
using Microsoft.Extensions.Localization;
using Portfolio.Application.DTOs;
using Portfolio.Application.Resources;

namespace Portfolio.Application.Validators;

public class UpdateProjectDtoValidator : AbstractValidator<UpdateProjectDto>
{
    public UpdateProjectDtoValidator(IStringLocalizer<SharedResource> localizer)
    {
        // Translations validation
        RuleFor(x => x.Translations)
            .NotEmpty().WithMessage(localizer["Validation_TranslationsRequired"])
            .Must(translations => translations != null && translations.Any())
            .WithMessage(localizer["Validation_TranslationsRequired"]);

        RuleForEach(x => x.Translations)
            .SetValidator(new UpdateProjectTranslationDtoValidator(localizer));

        // Common fields validation
        RuleFor(x => x.GitHubUrl)
            .Must(BeValidUrl).WithMessage(localizer["Validation_GitHubUrlInvalid"])
            .When(x => !string.IsNullOrEmpty(x.GitHubUrl));

        RuleFor(x => x.LiveUrl)
            .Must(BeValidUrl).WithMessage(localizer["Validation_LiveUrlInvalid"])
            .When(x => !string.IsNullOrEmpty(x.LiveUrl));

        RuleFor(x => x.ImageUrl)
            .Must(BeValidUrl).WithMessage(localizer["Validation_ImageUrlInvalid"])
            .When(x => !string.IsNullOrEmpty(x.ImageUrl));

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0).WithMessage(localizer["Validation_DisplayOrderInvalid"]);
    }

    private static bool BeValidUrl(string? url)
    {
        if (string.IsNullOrEmpty(url))
            return true;

        return Uri.TryCreate(url, UriKind.Absolute, out _);
    }
}
