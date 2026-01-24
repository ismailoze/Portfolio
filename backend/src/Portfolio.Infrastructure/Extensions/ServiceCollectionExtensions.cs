using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Portfolio.Application.Common.Mappings;
using Portfolio.Application.Interfaces;
using Portfolio.Application.Validators;
using Portfolio.Infrastructure.Data;
using Portfolio.Infrastructure.Services;

namespace Portfolio.Infrastructure.Extensions;

/// <summary>
/// Infrastructure katmanı için DI extension metodları
/// </summary>
public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Database
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' bulunamadı.");

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString));

        // Identity
        services.AddIdentityCore<ApplicationUser>(options =>
        {
            // Password settings
            options.Password.RequireDigit = true;
            options.Password.RequireLowercase = true;
            options.Password.RequireUppercase = true;
            options.Password.RequireNonAlphanumeric = true;
            options.Password.RequiredLength = 8;

            // User settings
            options.User.RequireUniqueEmail = true;
            options.SignIn.RequireConfirmedEmail = false; // Development için false
        })
        .AddRoles<IdentityRole>()
        .AddEntityFrameworkStores<ApplicationDbContext>();

        // AutoMapper
        services.AddAutoMapper(typeof(MappingProfile));

        // FluentValidation
        services.AddValidatorsFromAssemblyContaining<CreateProjectDtoValidator>();

        // HttpClient for external services
        services.AddHttpClient();

        // Services
        services.AddScoped<JwtTokenService>();
        services.AddScoped<TurnstileService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IProjectService, ProjectService>();
        services.AddScoped<IBlogPostService, BlogPostService>();
        services.AddScoped<IWorkExperienceService, WorkExperienceService>();
        services.AddScoped<IEducationService, EducationService>();
        services.AddScoped<ISkillService, SkillService>();
        services.AddScoped<IContactService, ContactService>();
        services.AddScoped<IEmailService, SmtpEmailService>();

        return services;
    }
}
