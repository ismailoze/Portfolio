using FluentValidation;
using Microsoft.Extensions.Localization;
using Portfolio.Application.DTOs;
using Portfolio.Application.Resources;

namespace Portfolio.Application.Validators;

public class CreateBlogPostDtoValidator : AbstractValidator<CreateBlogPostDto>
{
    public CreateBlogPostDtoValidator(IStringLocalizer<SharedResource> localizer)
    {
        // Translations validation
        RuleFor(x => x.Translations)
            .NotEmpty().WithMessage(localizer["Validation_TranslationsRequired"])
            .Must(translations => translations != null && translations.Any())
            .WithMessage(localizer["Validation_TranslationsRequired"]);

        RuleForEach(x => x.Translations)
            .SetValidator(new CreateBlogPostTranslationDtoValidator(localizer));
    }
}
