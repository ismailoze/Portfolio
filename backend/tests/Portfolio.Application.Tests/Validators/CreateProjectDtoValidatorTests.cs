using FluentAssertions;
using Portfolio.Application.DTOs;
using Portfolio.Application.Validators;
using Xunit;

namespace Portfolio.Application.Tests.Validators;

/// <summary>
/// CreateProjectDtoValidator için unit testler
/// </summary>
public class CreateProjectDtoValidatorTests
{
    [Fact]
    public void Validate_ValidInput_ShouldPass()
    {
        // Arrange
        var validator = new CreateProjectDtoValidator();
        var dto = new CreateProjectDto(
            "Test Project",
            "This is a test project description",
            "Angular, .NET",
            "https://github.com/test",
            "https://test.com",
            "https://test.com/image.jpg",
            true,
            1
        );

        // Act
        var result = validator.Validate(dto);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Validate_EmptyTitle_ShouldFail()
    {
        // Arrange
        var validator = new CreateProjectDtoValidator();
        var dto = new CreateProjectDto(
            "",
            "Description",
            null,
            null,
            null,
            null,
            false,
            0
        );

        // Act
        var result = validator.Validate(dto);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Title");
    }

    [Fact]
    public void Validate_EmptyDescription_ShouldFail()
    {
        // Arrange
        var validator = new CreateProjectDtoValidator();
        var dto = new CreateProjectDto(
            "Title",
            "",
            null,
            null,
            null,
            null,
            false,
            0
        );

        // Act
        var result = validator.Validate(dto);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Description");
    }

    [Fact]
    public void Validate_InvalidUrl_ShouldFail()
    {
        // Arrange
        var validator = new CreateProjectDtoValidator();
        var dto = new CreateProjectDto(
            "Title",
            "Description",
            null,
            "not-a-valid-url",
            null,
            null,
            false,
            0
        );

        // Act
        var result = validator.Validate(dto);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "GitHubUrl");
    }
}
