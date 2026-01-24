using FluentValidation;
using Microsoft.Extensions.Localization;
using Portfolio.Application.DTOs;
using Portfolio.Application.Resources;

namespace Portfolio.Application.Validators;

public class RegisterDtoValidator : AbstractValidator<RegisterDto>
{
    public RegisterDtoValidator(IStringLocalizer<SharedResource> localizer)
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage(localizer["Validation_EmailRequired"])
            .EmailAddress().WithMessage(localizer["Validation_EmailInvalid"]);

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage(localizer["Validation_PasswordRequired"])
            .MinimumLength(8).WithMessage(localizer["Validation_PasswordMinLength"])
            .Matches(@"[A-Z]").WithMessage(localizer["Validation_PasswordUppercase"])
            .Matches(@"[a-z]").WithMessage(localizer["Validation_PasswordLowercase"])
            .Matches(@"[0-9]").WithMessage(localizer["Validation_PasswordDigit"])
            .Matches(@"[!@#$%^&*(),.?\""{}|<>]").WithMessage(localizer["Validation_PasswordSpecialChar"]);

        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage(localizer["Validation_FirstNameRequired"])
            .MaximumLength(50).WithMessage(localizer["Validation_FirstNameMaxLength"]);

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage(localizer["Validation_LastNameRequired"])
            .MaximumLength(50).WithMessage(localizer["Validation_LastNameMaxLength"]);
    }
}
