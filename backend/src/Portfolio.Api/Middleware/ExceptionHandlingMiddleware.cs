using Microsoft.Extensions.Localization;
using Portfolio.Application.Resources;
using Portfolio.Domain.Common;
using System.Net;
using System.Text.Json;

namespace Portfolio.Api.Middleware;

/// <summary>
/// Exception handling middleware - Result pattern'den gelen hataları HTTP response'a çevirir
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    private readonly IStringLocalizer<SharedResource> _localizer;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger,
        IStringLocalizer<SharedResource> localizer)
    {
        _next = next;
        _logger = logger;
        _localizer = localizer;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Beklenmeyen bir hata oluştu: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var code = HttpStatusCode.InternalServerError;
        var errorMessage = _localizer["Error_General"];
        var result = JsonSerializer.Serialize(new { error = errorMessage });

        // Development ortamında detaylı hata bilgisi göster
        if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
        {
            result = JsonSerializer.Serialize(new
            {
                error = exception.Message,
                stackTrace = exception.StackTrace,
                innerException = exception.InnerException?.Message
            });
        }

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)code;
        return context.Response.WriteAsync(result);
    }
}
