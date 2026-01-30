using FluentAssertions;
using Microsoft.Extensions.Localization;
using Moq;
using Portfolio.Application.DTOs;
using Portfolio.Application.Interfaces;
using Portfolio.Application.Resources;
using Portfolio.Application.Validators;
using Portfolio.Domain.Common;
using Xunit;

namespace Portfolio.Application.Tests.Services;

/// <summary>
/// AuthService için unit testler
/// Not: Bu testler Infrastructure layer'daki AuthService implementasyonunu test eder
/// </summary>
public class AuthServiceTests
{
    private static IStringLocalizer<SharedResource> CreateMockLocalizer()
    {
        var mock = new Mock<IStringLocalizer<SharedResource>>();
        mock.Setup(l => l[It.IsAny<string>()]).Returns((string key) => new LocalizedString(key, key));
        return mock.Object;
    }

    [Fact]
    public void LoginDtoValidator_ValidInput_ShouldPass()
    {
        // Arrange
        var validator = new LoginDtoValidator(CreateMockLocalizer());
        var dto = new LoginDto("test@example.com", "Password123!");

        // Act
        var result = validator.Validate(dto);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void LoginDtoValidator_InvalidEmail_ShouldFail()
    {
        // Arrange
        var validator = new LoginDtoValidator(CreateMockLocalizer());
        var dto = new LoginDto("invalid-email", "Password123!");

        // Act
        var result = validator.Validate(dto);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Email");
    }

    [Fact]
    public void LoginDtoValidator_EmptyPassword_ShouldFail()
    {
        // Arrange
        var validator = new LoginDtoValidator(CreateMockLocalizer());
        var dto = new LoginDto("test@example.com", "");

        // Act
        var result = validator.Validate(dto);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Password");
    }

    [Fact]
    public void RegisterDtoValidator_ValidInput_ShouldPass()
    {
        // Arrange
        var validator = new RegisterDtoValidator(CreateMockLocalizer());
        var dto = new RegisterDto(
            "test@example.com",
            "Password123!",
            "John",
            "Doe"
        );

        // Act
        var result = validator.Validate(dto);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void RegisterDtoValidator_ShortPassword_ShouldFail()
    {
        // Arrange
        var validator = new RegisterDtoValidator(CreateMockLocalizer());
        var dto = new RegisterDto(
            "test@example.com",
            "Short1!",
            "John",
            "Doe"
        );

        // Act
        var result = validator.Validate(dto);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Password");
    }

    [Fact]
    public void RegisterDtoValidator_WeakPassword_ShouldFail()
    {
        // Arrange
        var validator = new RegisterDtoValidator(CreateMockLocalizer());
        var dto = new RegisterDto(
            "test@example.com",
            "weak",
            "John",
            "Doe"
        );

        // Act
        var result = validator.Validate(dto);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Password");
    }
}
