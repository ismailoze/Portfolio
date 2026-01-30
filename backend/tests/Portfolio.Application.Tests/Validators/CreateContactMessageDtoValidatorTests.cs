using FluentAssertions;
using Microsoft.Extensions.Localization;
using Moq;
using Portfolio.Application.DTOs;
using Portfolio.Application.Resources;
using Portfolio.Application.Validators;
using Xunit;

namespace Portfolio.Application.Tests.Validators;

/// <summary>
/// CreateContactMessageDtoValidator için unit testler
/// </summary>
public class CreateContactMessageDtoValidatorTests
{
    private static IStringLocalizer<SharedResource> CreateMockLocalizer()
    {
        var mock = new Mock<IStringLocalizer<SharedResource>>();
        mock.Setup(l => l[It.IsAny<string>()]).Returns((string key) => new LocalizedString(key, key));
        return mock.Object;
    }

    private static CreateContactMessageDto ValidDto(
        string name = "Test User",
        string email = "test@example.com",
        string subject = "Test Subject",
        string message = "Test message content") =>
        new CreateContactMessageDto(name, email, subject, message);

    [Fact]
    public void Validate_ValidInput_ShouldPass()
    {
        var validator = new CreateContactMessageDtoValidator(CreateMockLocalizer());
        var dto = ValidDto();

        var result = validator.Validate(dto);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Validate_EmptyName_ShouldFail()
    {
        var validator = new CreateContactMessageDtoValidator(CreateMockLocalizer());
        var dto = ValidDto(name: "");

        var result = validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Name");
    }

    [Fact]
    public void Validate_NameExceedsMaxLength_ShouldFail()
    {
        var validator = new CreateContactMessageDtoValidator(CreateMockLocalizer());
        var dto = ValidDto(name: new string('x', 101));

        var result = validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Name");
    }

    [Fact]
    public void Validate_InvalidEmail_ShouldFail()
    {
        var validator = new CreateContactMessageDtoValidator(CreateMockLocalizer());
        var dto = ValidDto(email: "invalid-email");

        var result = validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Email");
    }

    [Fact]
    public void Validate_EmptyEmail_ShouldFail()
    {
        var validator = new CreateContactMessageDtoValidator(CreateMockLocalizer());
        var dto = ValidDto(email: "");

        var result = validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Email");
    }

    [Fact]
    public void Validate_EmptySubject_ShouldFail()
    {
        var validator = new CreateContactMessageDtoValidator(CreateMockLocalizer());
        var dto = ValidDto(subject: "");

        var result = validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Subject");
    }

    [Fact]
    public void Validate_SubjectExceedsMaxLength_ShouldFail()
    {
        var validator = new CreateContactMessageDtoValidator(CreateMockLocalizer());
        var dto = ValidDto(subject: new string('x', 201));

        var result = validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Subject");
    }

    [Fact]
    public void Validate_EmptyMessage_ShouldFail()
    {
        var validator = new CreateContactMessageDtoValidator(CreateMockLocalizer());
        var dto = ValidDto(message: "");

        var result = validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Message");
    }

    [Fact]
    public void Validate_MessageExceedsMaxLength_ShouldFail()
    {
        var validator = new CreateContactMessageDtoValidator(CreateMockLocalizer());
        var dto = ValidDto(message: new string('x', 2001));

        var result = validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Message");
    }
}
