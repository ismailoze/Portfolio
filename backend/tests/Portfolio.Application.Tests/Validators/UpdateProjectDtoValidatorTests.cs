using FluentAssertions;
using Microsoft.Extensions.Localization;
using Moq;
using Portfolio.Application.DTOs;
using Portfolio.Application.Resources;
using Portfolio.Application.Validators;
using Xunit;

namespace Portfolio.Application.Tests.Validators;

/// <summary>
/// UpdateProjectDtoValidator için unit testler
/// </summary>
public class UpdateProjectDtoValidatorTests
{
    private static IStringLocalizer<SharedResource> CreateMockLocalizer()
    {
        var mock = new Mock<IStringLocalizer<SharedResource>>();
        mock.Setup(l => l[It.IsAny<string>()]).Returns((string key) => new LocalizedString(key, key));
        return mock.Object;
    }

    private static UpdateProjectDto ValidDto(
        string? githubUrl = "https://github.com/test",
        string? liveUrl = "https://test.com",
        string? imageUrl = null,
        bool isPublished = true,
        int displayOrder = 1) =>
        new UpdateProjectDto(
            Translations: new[]
            {
                new UpdateProjectTranslationDto("en", "Test Project", "Description", "Angular")
            },
            GitHubUrl: githubUrl,
            LiveUrl: liveUrl,
            ImageUrl: imageUrl,
            IsPublished: isPublished,
            DisplayOrder: displayOrder
        );

    [Fact]
    public void Validate_ValidInput_ShouldPass()
    {
        var validator = new UpdateProjectDtoValidator(CreateMockLocalizer());
        var dto = ValidDto();

        var result = validator.Validate(dto);

        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Validate_EmptyTranslations_ShouldFail()
    {
        var validator = new UpdateProjectDtoValidator(CreateMockLocalizer());
        var dto = new UpdateProjectDto(
            Translations: Array.Empty<UpdateProjectTranslationDto>(),
            GitHubUrl: null,
            LiveUrl: null,
            ImageUrl: null,
            IsPublished: false,
            DisplayOrder: 0
        );

        var result = validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Translations");
    }

    [Fact]
    public void Validate_InvalidGitHubUrl_ShouldFail()
    {
        var validator = new UpdateProjectDtoValidator(CreateMockLocalizer());
        var dto = ValidDto(githubUrl: "not-a-valid-url");

        var result = validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "GitHubUrl");
    }

    [Fact]
    public void Validate_InvalidLiveUrl_ShouldFail()
    {
        var validator = new UpdateProjectDtoValidator(CreateMockLocalizer());
        var dto = ValidDto(liveUrl: "invalid");

        var result = validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "LiveUrl");
    }

    [Fact]
    public void Validate_InvalidImageUrl_ShouldFail()
    {
        var validator = new UpdateProjectDtoValidator(CreateMockLocalizer());
        var dto = ValidDto(imageUrl: "not-a-url");

        var result = validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "ImageUrl");
    }

    [Fact]
    public void Validate_NegativeDisplayOrder_ShouldFail()
    {
        var validator = new UpdateProjectDtoValidator(CreateMockLocalizer());
        var dto = ValidDto(displayOrder: -1);

        var result = validator.Validate(dto);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "DisplayOrder");
    }

    [Fact]
    public void Validate_NullOptionalUrls_ShouldPass()
    {
        var validator = new UpdateProjectDtoValidator(CreateMockLocalizer());
        var dto = ValidDto(githubUrl: null, liveUrl: null, imageUrl: null);

        var result = validator.Validate(dto);

        result.IsValid.Should().BeTrue();
    }
}
