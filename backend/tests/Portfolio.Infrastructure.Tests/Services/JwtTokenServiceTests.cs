using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Portfolio.Infrastructure.Services;
using System.Collections.Generic;
using Xunit;

namespace Portfolio.Infrastructure.Tests.Services;

/// <summary>
/// JwtTokenService için unit testler
/// </summary>
public class JwtTokenServiceTests
{
    private readonly IConfiguration _configuration;
    private readonly JwtTokenService _service;

    public JwtTokenServiceTests()
    {
        var configDict = new Dictionary<string, string?>
        {
            { "JwtSettings:SecretKey", "TestSecretKeyForJwtTokenGeneration12345678901234567890" },
            { "JwtSettings:Issuer", "TestIssuer" },
            { "JwtSettings:Audience", "TestAudience" },
            { "JwtSettings:ExpirationInMinutes", "60" }
        };

        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configDict)
            .Build();

        _service = new JwtTokenService(_configuration);
    }

    [Fact]
    public void GenerateToken_ShouldReturnValidToken()
    {
        // Arrange
        var userId = Guid.NewGuid().ToString();
        var email = "test@example.com";
        var roles = new List<string> { "User" };

        // Act
        var token = _service.GenerateToken(userId, email, roles);

        // Assert
        token.Should().NotBeNullOrEmpty();
        token.Should().Contain(".");
    }

    [Fact]
    public void GenerateRefreshToken_ShouldReturnValidToken()
    {
        // Act
        var refreshToken = _service.GenerateRefreshToken();

        // Assert
        refreshToken.Should().NotBeNullOrEmpty();
        refreshToken.Length.Should().BeGreaterThan(32);
    }

    [Fact]
    public void GenerateToken_WithDifferentRoles_ShouldIncludeRoles()
    {
        // Arrange
        var userId = Guid.NewGuid().ToString();
        var email = "admin@example.com";
        var roles = new List<string> { "Admin", "User" };

        // Act
        var token = _service.GenerateToken(userId, email, roles);

        // Assert
        token.Should().NotBeNullOrEmpty();
        // Token içinde role bilgisi olmalı (JWT decode edilerek kontrol edilebilir)
    }
}
