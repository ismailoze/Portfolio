using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Text.Json;

namespace Portfolio.Infrastructure.Services;

/// <summary>
/// Cloudflare Turnstile doğrulama servisi
/// </summary>
public class TurnstileService
{
    private readonly HttpClient _httpClient;
    private readonly string _secretKey;
    private readonly ILogger<TurnstileService> _logger;

    public TurnstileService(
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory,
        ILogger<TurnstileService> logger)
    {
        _httpClient = httpClientFactory.CreateClient();
        _secretKey = configuration["CloudflareTurnstile:SecretKey"] ?? string.Empty;
        _logger = logger;
    }

    /// <summary>
    /// Turnstile token'ını doğrula
    /// </summary>
    public async Task<bool> VerifyTokenAsync(string token, string? remoteIp = null)
    {
        // Secret key yoksa doğrulamayı atla (development için)
        if (string.IsNullOrWhiteSpace(_secretKey))
        {
            _logger.LogWarning("Cloudflare Turnstile secret key tanımlı değil. Doğrulama atlanıyor.");
            return true; // Development ortamında doğrulamayı atla
        }

        if (string.IsNullOrWhiteSpace(token))
        {
            return false;
        }

        try
        {
            var formData = new List<KeyValuePair<string, string>>
            {
                new("secret", _secretKey),
                new("response", token)
            };

            if (!string.IsNullOrWhiteSpace(remoteIp))
            {
                formData.Add(new KeyValuePair<string, string>("remoteip", remoteIp));
            }

            var content = new FormUrlEncodedContent(formData);
            var response = await _httpClient.PostAsync("https://challenges.cloudflare.com/turnstile/v0/siteverify", content);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Turnstile doğrulama isteği başarısız. Status: {StatusCode}", response.StatusCode);
                return false;
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<TurnstileVerificationResponse>(responseContent);

            if (result == null)
            {
                _logger.LogWarning("Turnstile doğrulama yanıtı parse edilemedi.");
                return false;
            }

            if (!result.Success)
            {
                _logger.LogWarning("Turnstile doğrulama başarısız. Hatalar: {Errors}",
                    string.Join(", ", result.ErrorCodes ?? Array.Empty<string>()));
            }

            return result.Success;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Turnstile token doğrulama sırasında hata oluştu.");
            return false;
        }
    }

    private class TurnstileVerificationResponse
    {
        public bool Success { get; set; }
        public string[]? ErrorCodes { get; set; }
    }
}
