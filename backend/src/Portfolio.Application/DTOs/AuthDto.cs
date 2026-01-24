namespace Portfolio.Application.DTOs;

public record LoginDto(
    string Email,
    string Password,
    string? TurnstileToken = null
);

public record RegisterDto(
    string Email,
    string Password,
    string FirstName,
    string LastName
);

public record AuthResponseDto(
    string Token,
    string RefreshToken,
    DateTime ExpiresAt,
    string Email,
    string? FirstName,
    string? LastName
);

public record RefreshTokenDto(
    string Token,
    string RefreshToken
);
