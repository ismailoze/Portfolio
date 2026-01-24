using System.Diagnostics;

namespace Portfolio.Api.Middleware;

/// <summary>
/// Request logging middleware - Her request için structured logging
/// </summary>
public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();
        var requestPath = context.Request.Path;
        var requestMethod = context.Request.Method;
        var correlationId = context.TraceIdentifier;

        _logger.LogInformation(
            "HTTP {Method} {Path} başlatıldı. CorrelationId: {CorrelationId}",
            requestMethod,
            requestPath,
            correlationId
        );

        try
        {
            await _next(context);
            stopwatch.Stop();

            var statusCode = context.Response.StatusCode;
            _logger.LogInformation(
                "HTTP {Method} {Path} tamamlandı. StatusCode: {StatusCode}, Süre: {ElapsedMilliseconds}ms, CorrelationId: {CorrelationId}",
                requestMethod,
                requestPath,
                statusCode,
                stopwatch.ElapsedMilliseconds,
                correlationId
            );
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            _logger.LogError(
                ex,
                "HTTP {Method} {Path} hata ile sonlandı. Süre: {ElapsedMilliseconds}ms, CorrelationId: {CorrelationId}",
                requestMethod,
                requestPath,
                stopwatch.ElapsedMilliseconds,
                correlationId
            );
            throw;
        }
    }
}
