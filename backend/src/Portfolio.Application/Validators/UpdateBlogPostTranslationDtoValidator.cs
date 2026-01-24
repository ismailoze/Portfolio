using FluentValidation;
using Microsoft.Extensions.Localization;
using Portfolio.Application.DTOs;
using Portfolio.Application.Resources;

namespace Portfolio.Application.Validators;

public class UpdateBlogPostTranslationDtoValidator : AbstractValidator<UpdateBlogPostTranslationDto>
{
    public UpdateBlogPostTranslationDtoValidator(IStringLocalizer<SharedResource> localizer)
    {
        RuleFor(x => x.LanguageCode)
            .NotEmpty().WithMessage(localizer["Validation_LanguageCodeRequired"])
            .Must(code => code == "tr" || code == "en")
            .WithMessage(localizer["Validation_LanguageCodeInvalid"]);

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage(localizer["Validation_BlogTitleRequired"])
            .MaximumLength(200).WithMessage(localizer["Validation_BlogTitleMaxLength"]);

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage(localizer["Validation_BlogContentRequired"]);

        RuleFor(x => x.Excerpt)
            .NotEmpty().WithMessage(localizer["Validation_BlogExcerptRequired"])
            .MaximumLength(500).WithMessage(localizer["Validation_BlogExcerptMaxLength"]);

        RuleFor(x => x.Slug)
            .NotEmpty().WithMessage(localizer["Validation_SlugRequired"])
            .Matches(@"^[a-z0-9]+(?:-[a-z0-9]+)*$")
            .WithMessage(localizer["Validation_SlugInvalid"]);
    }
}
