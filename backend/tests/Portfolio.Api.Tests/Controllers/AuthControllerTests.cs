using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Api.Controllers;
using Portfolio.Application.DTOs;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Common;
using Moq;
using Xunit;

namespace Portfolio.Api.Tests.Controllers;

/// <summary>
/// AuthController için integration testler
/// </summary>
public class AuthControllerTests
{
    private readonly Mock<IAuthService> _authServiceMock;
    private readonly AuthController _controller;

    public AuthControllerTests()
    {
        _authServiceMock = new Mock<IAuthService>();
        _controller = new AuthController(_authServiceMock.Object);
    }

    [Fact]
    public async Task Login_ValidCredentials_ShouldReturnOk()
    {
        // Arrange
        var loginDto = new LoginDto("test@example.com", "Password123!");
        var authResponse = new AuthResponseDto(
            Token: "mock-token",
            RefreshToken: "mock-refresh-token",
            ExpiresAt: DateTime.UtcNow.AddMinutes(60),
            Email: "test@example.com",
            FirstName: "Test",
            LastName: "User"
        );

        _authServiceMock
            .Setup(x => x.LoginAsync(loginDto))
            .ReturnsAsync(Result.Success(authResponse));

        // Act
        var result = await _controller.Login(loginDto);

        // Assert
        result.Should().BeOfType<OkObjectResult>();
        var okResult = result as OkObjectResult;
        okResult!.Value.Should().BeEquivalentTo(authResponse);
    }

    [Fact]
    public async Task Login_InvalidCredentials_ShouldReturnBadRequest()
    {
        // Arrange
        var loginDto = new LoginDto("test@example.com", "WrongPassword");

        _authServiceMock
            .Setup(x => x.LoginAsync(loginDto))
            .ReturnsAsync(Result.Failure<AuthResponseDto>("Geçersiz email veya şifre."));

        // Act
        var result = await _controller.Login(loginDto);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
        var badRequestResult = result as BadRequestObjectResult;
        badRequestResult.Should().NotBeNull();
        badRequestResult!.Value.Should().NotBeNull();
    }

    [Fact]
    public async Task Register_ValidData_ShouldReturnOk()
    {
        // Arrange
        var registerDto = new RegisterDto(
            "test@example.com",
            "Password123!",
            "Test",
            "User"
        );

        var authResponse = new AuthResponseDto(
            Token: "mock-token",
            RefreshToken: "mock-refresh-token",
            ExpiresAt: DateTime.UtcNow.AddMinutes(60),
            Email: "test@example.com",
            FirstName: "Test",
            LastName: "User"
        );

        _authServiceMock
            .Setup(x => x.RegisterAsync(registerDto))
            .ReturnsAsync(Result.Success(authResponse));

        // Act
        var result = await _controller.Register(registerDto);

        // Assert
        result.Should().BeOfType<OkObjectResult>();
        var okResult = result as OkObjectResult;
        okResult!.Value.Should().BeEquivalentTo(authResponse);
    }

    [Fact]
    public async Task Register_DuplicateEmail_ShouldReturnBadRequest()
    {
        // Arrange
        var registerDto = new RegisterDto(
            "existing@example.com",
            "Password123!",
            "Test",
            "User"
        );

        _authServiceMock
            .Setup(x => x.RegisterAsync(registerDto))
            .ReturnsAsync(Result.Failure<AuthResponseDto>("Bu email adresi zaten kullanılıyor."));

        // Act
        var result = await _controller.Register(registerDto);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
        var badRequestResult = result as BadRequestObjectResult;
        badRequestResult.Should().NotBeNull();
        badRequestResult!.Value.Should().NotBeNull();
    }
}
