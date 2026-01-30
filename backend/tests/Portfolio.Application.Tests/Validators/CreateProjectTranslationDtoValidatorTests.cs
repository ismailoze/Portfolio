using FluentAssertions;
using Microsoft.Extensions.Localization;
using Moq;
using Portfolio.Application.DTOs;
using Portfolio.Application.Resources;
using Portfolio.Application.Validators;
using Xunit;

namespace Portfolio.Application.Tests.Validators;

/// <summary>
/// CreateProjectTranslationDtoValidator için unit testler
/// </summary>
public class CreateProjectTranslationDtoValidatorTests
{
    private static IStringLocalizer<SharedResource> CreateMockLocalizer()
    {
        var mock = new Mock<IStringLocalizer<SharedResource>>();
        mock.Setup(l => l[It.IsAny<string>()]).Returns((string key) => new LocalizedString(key, key));
        return mock.Object;
    }

    private static CreateProjectTranslationDto ValidDto(
        string languageCode = "en",
        string title = "Test Title",
        string description = "Test description",
        string? technologies = "Angular") =>
        new CreateProjectTranslationDto(languageCode, title, description, technologies);

    [Fact]
    public void Validate_ValidInput_ShouldPass()
    {
        var validator = new CreateProjectTranslationDtoValidator(CreateMockLocalizer());
        var dto = ValidDto();

        var result = validator.Validate(dto);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Validate_ValidTurkish_ShouldPass()
    {
        var validator = new CreateProjectTranslationDtoValidator(CreateMockLocalizer());
        var dto = ValidDto(languageCode: "tr");

        var result = validator.Validate(dto);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Validate_EmptyLanguageCode_ShouldFail()
    {
        var validator = new CreateProjectTranslationDtoValidator(CreateMockLocalizer());
        var dto = ValidDto(languageCode: "");

        var result = validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "LanguageCode");
    }

    [Fact]
    public void Validate_InvalidLanguageCode_ShouldFail()
    {
        var validator = new CreateProjectTranslationDtoValidator(CreateMockLocalizer());
        var dto = ValidDto(languageCode: "de");

        var result = validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "LanguageCode");
    }

    [Fact]
    public void Validate_EmptyTitle_ShouldFail()
    {
        var validator = new CreateProjectTranslationDtoValidator(CreateMockLocalizer());
        var dto = ValidDto(title: "");

        var result = validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Title");
    }

    [Fact]
    public void Validate_TitleExceedsMaxLength_ShouldFail()
    {
        var validator = new CreateProjectTranslationDtoValidator(CreateMockLocalizer());
        var dto = ValidDto(title: new string('x', 201));

        var result = validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Title");
    }

    [Fact]
    public void Validate_EmptyDescription_ShouldFail()
    {
        var validator = new CreateProjectTranslationDtoValidator(CreateMockLocalizer());
        var dto = ValidDto(description: "");

        var result = validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Description");
    }

    [Fact]
    public void Validate_DescriptionExceedsMaxLength_ShouldFail()
    {
        var validator = new CreateProjectTranslationDtoValidator(CreateMockLocalizer());
        var dto = ValidDto(description: new string('x', 2001));

        var result = validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Description");
    }
}
