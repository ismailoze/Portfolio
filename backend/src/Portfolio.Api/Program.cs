using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Portfolio.Api.Middleware;
using Portfolio.Application.Resources;
using Portfolio.Infrastructure.Data;
using Portfolio.Infrastructure.Extensions;
using Serilog;
using System.Globalization;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Serilog configuration
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .CreateLogger();

builder.Host.UseSerilog();

// Localization
builder.Services.AddLocalization(options => options.ResourcesPath = "../Portfolio.Application/Resources");
builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    var supportedCultures = new[] { "tr", "en" };
    options.SetDefaultCulture("tr")
        .AddSupportedCultures(supportedCultures)
        .AddSupportedUICultures(supportedCultures)
        .RequestCultureProviders.Clear();

    // Accept-Language header'dan dil seçimi
    options.RequestCultureProviders.Add(new AcceptLanguageHeaderRequestCultureProvider());
});

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();
builder.Services.AddEndpointsApiExplorer();

// Swagger configuration with JWT
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Portfolio API",
        Version = "v1",
        Description = "Portfolio uygulaması için Web API"
    });

    // JWT Authentication için Swagger yapılandırması
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Infrastructure (Database, Identity)
builder.Services.AddInfrastructure(builder.Configuration);

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"]
    ?? throw new InvalidOperationException("JWT SecretKey bulunamadı.");
var issuer = jwtSettings["Issuer"] ?? "PortfolioApi";
var audience = jwtSettings["Audience"] ?? "PortfolioClient";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4600")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Localization middleware
app.UseRequestLocalization();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORS - UseHttpsRedirection öncesi olmalı
app.UseCors("AllowAngularApp");

// Middleware'ler
app.UseMiddleware<RequestLoggingMiddleware>();
app.UseMiddleware<ValidationMiddleware>();
app.UseMiddleware<ExceptionHandlingMiddleware>();

// HTTPS redirection - Development'ta devre dışı (frontend HTTP kullanıyor)
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Database migration ve seed (sadece development için)
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

        // Migrations otomatik uygula
        await context.Database.MigrateAsync();

        // Seed data
        await DbSeeder.SeedAsync(context, userManager, roleManager);
    }
    catch (Exception ex)
    {
        Log.Error(ex, "Database migration veya seed sırasında hata oluştu.");
    }
}

app.Run();
