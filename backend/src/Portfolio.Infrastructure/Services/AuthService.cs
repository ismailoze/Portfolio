using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Localization;
using Portfolio.Application.Resources;
using Portfolio.Application.DTOs;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Common;
using Portfolio.Infrastructure.Data;

namespace Portfolio.Infrastructure.Services;

/// <summary>
/// Authentication service implementation
/// </summary>
public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly JwtTokenService _jwtTokenService;
    private readonly TurnstileService _turnstileService;
    private readonly IStringLocalizer<SharedResource> _localizer;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        JwtTokenService jwtTokenService,
        TurnstileService turnstileService,
        IStringLocalizer<SharedResource> localizer,
        IHttpContextAccessor httpContextAccessor)
    {
        _userManager = userManager;
        _jwtTokenService = jwtTokenService;
        _turnstileService = turnstileService;
        _localizer = localizer;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<Result<AuthResponseDto>> LoginAsync(LoginDto dto)
    {
        // Turnstile token doğrulaması
        if (!string.IsNullOrWhiteSpace(dto.TurnstileToken))
        {
            var remoteIp = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString();
            var isValidTurnstile = await _turnstileService.VerifyTokenAsync(dto.TurnstileToken, remoteIp);

            if (!isValidTurnstile)
            {
                return Result.Failure<AuthResponseDto>(_localizer["Auth_TurnstileVerificationFailed"]);
            }
        }

        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
        {
            return Result.Failure<AuthResponseDto>(_localizer["Auth_InvalidCredentials"]);
        }

        var isValidPassword = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!isValidPassword)
        {
            return Result.Failure<AuthResponseDto>(_localizer["Auth_InvalidCredentials"]);
        }

        var roles = await _userManager.GetRolesAsync(user);
        var token = _jwtTokenService.GenerateToken(user.Id, user.Email!, roles);
        var refreshToken = _jwtTokenService.GenerateRefreshToken();

        // Refresh token'ı kullanıcıya kaydet (basit implementasyon - production'da ayrı tablo kullanılmalı)
        // Şimdilik sadece token döndürüyoruz

        return Result.Success(new AuthResponseDto(
            Token: token,
            RefreshToken: refreshToken,
            ExpiresAt: DateTime.UtcNow.AddMinutes(60),
            Email: user.Email!,
            FirstName: user.FirstName,
            LastName: user.LastName
        ));
    }

    public async Task<Result<AuthResponseDto>> RegisterAsync(RegisterDto dto)
    {
        var existingUser = await _userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null)
        {
            return Result.Failure<AuthResponseDto>(_localizer["Auth_EmailAlreadyExists"]);
        }

        var user = new ApplicationUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            EmailConfirmed = true // Development için
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            return Result.Failure<AuthResponseDto>(string.Format(_localizer["Auth_UserCreationFailed"], errors));
        }

        // Default olarak User rolü ekle
        await _userManager.AddToRoleAsync(user, "User");

        var roles = await _userManager.GetRolesAsync(user);
        var token = _jwtTokenService.GenerateToken(user.Id, user.Email!, roles);
        var refreshToken = _jwtTokenService.GenerateRefreshToken();

        return Result.Success(new AuthResponseDto(
            Token: token,
            RefreshToken: refreshToken,
            ExpiresAt: DateTime.UtcNow.AddMinutes(60),
            Email: user.Email!,
            FirstName: user.FirstName,
            LastName: user.LastName
        ));
    }

    public Task<Result<AuthResponseDto>> RefreshTokenAsync(RefreshTokenDto dto)
    {
        // Basit implementasyon - production'da refresh token validation yapılmalı
        return Task.FromResult(Result.Failure<AuthResponseDto>(_localizer["Auth_RefreshTokenNotImplemented"]));
    }
}
