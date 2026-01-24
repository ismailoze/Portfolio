using FluentValidation;
using Microsoft.Extensions.Localization;
using Portfolio.Application.DTOs;
using Portfolio.Application.Resources;

namespace Portfolio.Application.Validators;

public class CreateProjectTranslationDtoValidator : AbstractValidator<CreateProjectTranslationDto>
{
    public CreateProjectTranslationDtoValidator(IStringLocalizer<SharedResource> localizer)
    {
        RuleFor(x => x.LanguageCode)
            .NotEmpty().WithMessage(localizer["Validation_LanguageCodeRequired"])
            .Must(code => code == "tr" || code == "en")
            .WithMessage(localizer["Validation_LanguageCodeInvalid"]);

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage(localizer["Validation_ProjectTitleRequired"])
            .MaximumLength(200).WithMessage(localizer["Validation_ProjectTitleMaxLength"]);

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage(localizer["Validation_ProjectDescriptionRequired"])
            .MaximumLength(2000).WithMessage(localizer["Validation_ProjectDescriptionMaxLength"]);
    }
}
