using FluentValidation;
using Microsoft.Extensions.Localization;
using Portfolio.Application.DTOs;
using Portfolio.Application.Resources;

namespace Portfolio.Application.Validators;

public class CreateContactMessageDtoValidator : AbstractValidator<CreateContactMessageDto>
{
    public CreateContactMessageDtoValidator(IStringLocalizer<SharedResource> localizer)
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage(localizer["Validation_NameRequired"])
            .MaximumLength(100).WithMessage(localizer["Validation_NameMaxLength"]);

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage(localizer["Validation_EmailRequired"])
            .EmailAddress().WithMessage(localizer["Validation_EmailInvalid"])
            .MaximumLength(200).WithMessage(localizer["Validation_EmailInvalid"]);

        RuleFor(x => x.Subject)
            .NotEmpty().WithMessage(localizer["Validation_SubjectRequired"])
            .MaximumLength(200).WithMessage(localizer["Validation_SubjectMaxLength"]);

        RuleFor(x => x.Message)
            .NotEmpty().WithMessage(localizer["Validation_MessageRequired"])
            .MaximumLength(2000).WithMessage(localizer["Validation_MessageMaxLength"]);
    }
}
