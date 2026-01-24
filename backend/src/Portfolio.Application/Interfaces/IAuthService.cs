using Portfolio.Application.DTOs;
using Portfolio.Domain.Common;

namespace Portfolio.Application.Interfaces;

public interface IAuthService
{
    Task<Result<AuthResponseDto>> LoginAsync(LoginDto dto);
    Task<Result<AuthResponseDto>> RegisterAsync(RegisterDto dto);
    Task<Result<AuthResponseDto>> RefreshTokenAsync(RefreshTokenDto dto);
}
