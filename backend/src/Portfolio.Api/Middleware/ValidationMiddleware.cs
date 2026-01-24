using FluentValidation;
using Microsoft.Extensions.Localization;
using Portfolio.Application.Resources;
using System.Text.Json;

namespace Portfolio.Api.Middleware;

/// <summary>
/// Validation middleware - FluentValidation hatalarını yakalar
/// </summary>
public class ValidationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IStringLocalizer<SharedResource> _localizer;

    public ValidationMiddleware(
        RequestDelegate next,
        IStringLocalizer<SharedResource> localizer)
    {
        _next = next;
        _localizer = localizer;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException ex)
        {
            context.Response.StatusCode = 400;
            context.Response.ContentType = "application/json";

            var errors = ex.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage).ToArray()
                );

            var result = JsonSerializer.Serialize(new
            {
                error = _localizer["Error_Validation"],
                errors = errors
            });

            await context.Response.WriteAsync(result);
        }
    }
}
