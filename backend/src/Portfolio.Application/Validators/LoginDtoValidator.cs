using FluentValidation;
using Microsoft.Extensions.Localization;
using Portfolio.Application.DTOs;
using Portfolio.Application.Resources;

namespace Portfolio.Application.Validators;

public class LoginDtoValidator : AbstractValidator<LoginDto>
{
    public LoginDtoValidator(IStringLocalizer<SharedResource> localizer)
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage(localizer["Validation_EmailRequired"])
            .EmailAddress().WithMessage(localizer["Validation_EmailInvalid"]);

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage(localizer["Validation_PasswordRequired"]);
    }
}
