using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Portfolio.Domain.Entities;
using Portfolio.Infrastructure.Data;

namespace Portfolio.Infrastructure.Data;

/// <summary>
/// Database seed data - Development için örnek veriler (TR ve EN)
/// </summary>
public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        // Roles oluştur
        await SeedRolesAsync(roleManager);

        // Tek kullanıcı oluştur (Admin)
        await SeedUserAsync(userManager);

        // Skills seed (dil bağımsız)
        await SeedSkillsAsync(context);

        // Projects seed (TR ve EN) - Translation tabloları kullanılacak
        await SeedProjectsAsync(context);

        // Blog Posts seed (TR ve EN) - Translation tabloları kullanılacak
        await SeedBlogPostsAsync(context);

        // Work Experience seed (TR ve EN)
        await SeedWorkExperiencesAsync(context);

        // Education seed (TR ve EN)
        await SeedEducationsAsync(context);
    }

    private static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
    {
        if (!await roleManager.RoleExistsAsync("Admin"))
        {
            await roleManager.CreateAsync(new IdentityRole("Admin"));
        }
    }

    private static async Task SeedUserAsync(UserManager<ApplicationUser> userManager)
    {
        var adminEmail = "ismailozer35041@gmail.com";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                FirstName = "Ismail",
                LastName = "Ozer",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(adminUser, "Passw0rd!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }
    }

    private static async Task<List<Skill>> SeedSkillsAsync(ApplicationDbContext context)
    {
        if (await context.Skills.AnyAsync())
        {
            return await context.Skills.ToListAsync();
        }

        var skills = new List<Skill>
        {
            new() { Name = "C#", Category = "Backend", Level = 5, DisplayOrder = 1, Icon = "simple-icons:csharp" },
            new() { Name = ".NET Core", Category = "Backend", Level = 5, DisplayOrder = 2, Icon = "simple-icons:dotnet" },
            new() { Name = "ASP.NET Core", Category = "Backend", Level = 5, DisplayOrder = 3, Icon = "simple-icons:microsoft" },
            new() { Name = "Entity Framework Core", Category = "Backend", Level = 5, DisplayOrder = 4, Icon = "simple-icons:microsoft" },
            new() { Name = "Angular", Category = "Frontend", Level = 4, DisplayOrder = 5, Icon = "simple-icons:angular" },
            new() { Name = "TypeScript", Category = "Frontend", Level = 4, DisplayOrder = 6, Icon = "simple-icons:typescript" },
            new() { Name = "JavaScript", Category = "Frontend", Level = 4, DisplayOrder = 7, Icon = "simple-icons:javascript" },
            new() { Name = "HTML/CSS", Category = "Frontend", Level = 5, DisplayOrder = 8, Icon = "simple-icons:html5" },
            new() { Name = "SCSS/SASS", Category = "Frontend", Level = 4, DisplayOrder = 9, Icon = "simple-icons:sass" },
            new() { Name = "PostgreSQL", Category = "Database", Level = 3, DisplayOrder = 10, Icon = "simple-icons:postgresql" },
            new() { Name = "Docker", Category = "DevOps", Level = 3, DisplayOrder = 11, Icon = "simple-icons:docker" },
            new() { Name = "Git", Category = "DevOps", Level = 4, DisplayOrder = 12, Icon = "simple-icons:git" },
            new() { Name = "GitHub Actions", Category = "DevOps", Level = 3, DisplayOrder = 13, Icon = "simple-icons:github" },
            new() { Name = "RESTful API", Category = "Backend", Level = 5, DisplayOrder = 14, Icon = "simple-icons:swagger" },
            new() { Name = "JWT", Category = "Backend", Level = 4, DisplayOrder = 15, Icon = "simple-icons:jsonwebtokens" }
        };

        await context.Skills.AddRangeAsync(skills);
        await context.SaveChangesAsync();

        return skills;
    }

    /// <summary>
    /// Projects seed - Translation entity pattern kullanarak TR ve EN içerikler
    /// </summary>
    private static async Task SeedProjectsAsync(ApplicationDbContext context)
    {
        if (await context.Projects.AnyAsync())
        {
            return;
        }

        var projects = new List<Project>
        {
            new()
            {
                GitHubUrl = "https://github.com/example/portfolio",
                LiveUrl = "https://example.com",
                ImageUrl = "https://via.placeholder.com/800x600",
                IsPublished = true,
                DisplayOrder = 1,
                Translations = new List<ProjectTranslation>
                {
                    new()
                    {
                        LanguageCode = "tr",
                        Title = "Portfolio Web Sitesi",
                        Description = "Modern ve responsive bir portfolio web sitesi. Angular ve .NET Core kullanılarak geliştirildi. Çok dilli destek, admin paneli ve blog özellikleri içerir.",
                        Technologies = "Angular, TypeScript, .NET Core, Entity Framework Core, PostgreSQL, Docker"
                    },
                    new()
                    {
                        LanguageCode = "en",
                        Title = "Portfolio Website",
                        Description = "A modern and responsive portfolio website. Built with Angular and .NET Core. Includes multilingual support, admin panel, and blog features.",
                        Technologies = "Angular, TypeScript, .NET Core, Entity Framework Core, PostgreSQL, Docker"
                    }
                }
            },
            new()
            {
                GitHubUrl = "https://github.com/example/ecommerce",
                LiveUrl = "https://ecommerce.example.com",
                ImageUrl = "https://via.placeholder.com/800x600",
                IsPublished = true,
                DisplayOrder = 2,
                Translations = new List<ProjectTranslation>
                {
                    new()
                    {
                        LanguageCode = "tr",
                        Title = "E-Ticaret Platformu",
                        Description = "Tam özellikli bir e-ticaret platformu. Ürün yönetimi, sepet, ödeme entegrasyonu ve sipariş takibi özellikleri içerir.",
                        Technologies = "ASP.NET Core, Entity Framework Core, SQL Server, Stripe API, React"
                    },
                    new()
                    {
                        LanguageCode = "en",
                        Title = "E-Commerce Platform",
                        Description = "A full-featured e-commerce platform. Includes product management, cart, payment integration, and order tracking features.",
                        Technologies = "ASP.NET Core, Entity Framework Core, SQL Server, Stripe API, React"
                    }
                }
            },
            new()
            {
                GitHubUrl = "https://github.com/example/taskmanager",
                IsPublished = true,
                DisplayOrder = 3,
                Translations = new List<ProjectTranslation>
                {
                    new()
                    {
                        LanguageCode = "tr",
                        Title = "Görev Yönetim Uygulaması",
                        Description = "Kullanıcı dostu bir görev yönetim uygulaması. Proje bazlı görev organizasyonu, zaman takibi ve işbirliği özellikleri sunar.",
                        Technologies = "Angular, TypeScript, .NET Core, SignalR, PostgreSQL"
                    },
                    new()
                    {
                        LanguageCode = "en",
                        Title = "Task Management Application",
                        Description = "A user-friendly task management application. Offers project-based task organization, time tracking, and collaboration features.",
                        Technologies = "Angular, TypeScript, .NET Core, SignalR, PostgreSQL"
                    }
                }
            }
        };

        await context.Projects.AddRangeAsync(projects);
        await context.SaveChangesAsync();
    }

    /// <summary>
    /// Blog Posts seed - Translation entity pattern kullanarak TR ve EN içerikler
    /// </summary>
    private static async Task SeedBlogPostsAsync(ApplicationDbContext context)
    {
        if (await context.BlogPosts.AnyAsync())
        {
            return;
        }

        var blogPosts = new List<BlogPost>
        {
            new()
            {
                IsPublished = true,
                PublishedAt = DateTime.UtcNow.AddDays(-10),
                FeaturedImageUrl = "https://via.placeholder.com/1200x600",
                Translations = new List<BlogPostTranslation>
                {
                    new()
                    {
                        LanguageCode = "tr",
                        Title = "Clean Architecture ile Modern Web Uygulamaları",
                        Slug = "clean-architecture-modern-web-uygulamalari",
                        Excerpt = "Clean Architecture prensiplerini kullanarak ölçeklenebilir ve bakımı kolay web uygulamaları nasıl geliştirilir?",
                        Content = @"# Clean Architecture ile Modern Web Uygulamaları

Clean Architecture, yazılım geliştirmede önemli bir mimari desendir. Bu yazıda, Clean Architecture prensiplerini kullanarak modern web uygulamaları nasıl geliştirilir, detaylı bir şekilde inceleyeceğiz.

## Clean Architecture Nedir?

Clean Architecture, Robert C. Martin tarafından önerilen bir mimari desendir. Temel amacı, bağımlılıkları tersine çevirerek, iş mantığını framework ve veritabanı gibi dış bağımlılıklardan bağımsız hale getirmektir.

## Avantajları

- **Test Edilebilirlik**: İş mantığı bağımsız olduğu için kolayca test edilebilir.
- **Bağımsızlık**: Framework ve veritabanı değişikliklerinden etkilenmez.
- **Bakım Kolaylığı**: Kod organizasyonu sayesinde bakım yapmak daha kolaydır.

## Sonuç

Clean Architecture, uzun vadeli projeler için ideal bir seçimdir."
                    },
                    new()
                    {
                        LanguageCode = "en",
                        Title = "Modern Web Applications with Clean Architecture",
                        Slug = "modern-web-applications-clean-architecture",
                        Excerpt = "How to develop scalable and maintainable web applications using Clean Architecture principles?",
                        Content = @"# Modern Web Applications with Clean Architecture

Clean Architecture is an important architectural pattern in software development. In this article, we will examine in detail how to develop modern web applications using Clean Architecture principles.

## What is Clean Architecture?

Clean Architecture is an architectural pattern proposed by Robert C. Martin. Its main purpose is to reverse dependencies, making business logic independent of external dependencies such as frameworks and databases.

## Advantages

- **Testability**: Business logic can be easily tested as it is independent.
- **Independence**: Not affected by framework and database changes.
- **Maintainability**: Maintenance is easier thanks to code organization.

## Conclusion

Clean Architecture is an ideal choice for long-term projects."
                    }
                }
            },
            new()
            {
                IsPublished = true,
                PublishedAt = DateTime.UtcNow.AddDays(-5),
                FeaturedImageUrl = "https://via.placeholder.com/1200x600",
                Translations = new List<BlogPostTranslation>
                {
                    new()
                    {
                        LanguageCode = "tr",
                        Title = "Angular ile Reactive Forms Kullanımı",
                        Slug = "angular-reactive-forms-kullanimi",
                        Excerpt = "Angular'da Reactive Forms kullanarak form validasyonu ve veri yönetimi nasıl yapılır?",
                        Content = @"# Angular ile Reactive Forms Kullanımı

Angular'da form yönetimi için iki ana yaklaşım vardır: Template-driven forms ve Reactive forms. Bu yazıda Reactive Forms yaklaşımını detaylı olarak inceleyeceğiz.

## Reactive Forms Nedir?

Reactive Forms, form kontrollerini TypeScript kodunda programatik olarak tanımlamanıza olanak tanır. Bu yaklaşım, daha fazla kontrol ve esneklik sağlar.

## Avantajları

- **Programatik Kontrol**: Form kontrolleri TypeScript kodunda tanımlanır.
- **Test Edilebilirlik**: Unit test yazmak daha kolaydır.
- **Dinamik Formlar**: Form yapısı runtime'da değiştirilebilir.

## Örnek Kullanım

```typescript
this.form = this.fb.group({
  name: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]]
});
```

## Sonuç

Reactive Forms, karmaşık form senaryoları için ideal bir seçimdir."
                    },
                    new()
                    {
                        LanguageCode = "en",
                        Title = "Using Reactive Forms with Angular",
                        Slug = "using-reactive-forms-angular",
                        Excerpt = "How to implement form validation and data management using Reactive Forms in Angular?",
                        Content = @"# Using Reactive Forms with Angular

There are two main approaches for form management in Angular: Template-driven forms and Reactive forms. In this article, we will examine the Reactive Forms approach in detail.

## What are Reactive Forms?

Reactive Forms allow you to define form controls programmatically in TypeScript code. This approach provides more control and flexibility.

## Advantages

- **Programmatic Control**: Form controls are defined in TypeScript code.
- **Testability**: Writing unit tests is easier.
- **Dynamic Forms**: Form structure can be changed at runtime.

## Example Usage

```typescript
this.form = this.fb.group({
  name: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]]
});
```

## Conclusion

Reactive Forms are an ideal choice for complex form scenarios."
                    }
                }
            },
            new()
            {
                IsPublished = false,
                Translations = new List<BlogPostTranslation>
                {
                    new()
                    {
                        LanguageCode = "tr",
                        Title = "Entity Framework Core Best Practices",
                        Slug = "entity-framework-core-best-practices",
                        Excerpt = "Entity Framework Core kullanırken dikkat edilmesi gereken best practice'ler ve performans optimizasyonları.",
                        Content = @"# Entity Framework Core Best Practices

Entity Framework Core, .NET ekosisteminde en popüler ORM araçlarından biridir. Bu yazıda, EF Core kullanırken dikkat edilmesi gereken best practice'leri inceleyeceğiz.

## Best Practices

- **AsNoTracking() Kullanımı**: Read-only sorgularda performans için.
- **Include() ile Eager Loading**: N+1 problem'ini önlemek için.
- **Migration Yönetimi**: Veritabanı değişikliklerini yönetmek için.

## Sonuç

Bu best practice'leri takip ederek, daha performanslı ve bakımı kolay uygulamalar geliştirebilirsiniz."
                    },
                    new()
                    {
                        LanguageCode = "en",
                        Title = "Entity Framework Core Best Practices",
                        Slug = "entity-framework-core-best-practices",
                        Excerpt = "Best practices and performance optimizations to consider when using Entity Framework Core.",
                        Content = @"# Entity Framework Core Best Practices

Entity Framework Core is one of the most popular ORM tools in the .NET ecosystem. In this article, we will examine the best practices to consider when using EF Core.

## Best Practices

- **Using AsNoTracking()**: For performance in read-only queries.
- **Eager Loading with Include()**: To prevent N+1 problems.
- **Migration Management**: To manage database changes.

## Conclusion

By following these best practices, you can develop more performant and maintainable applications."
                    }
                }
            }
        };

        await context.BlogPosts.AddRangeAsync(blogPosts);
        await context.SaveChangesAsync();
    }

    private static async Task SeedWorkExperiencesAsync(ApplicationDbContext context)
    {
        if (await context.WorkExperiences.AnyAsync())
        {
            return;
        }

        var experiences = new List<WorkExperience>
        {
            // TR
            new()
            {
                Company = "Teknoloji Çözümleri A.Ş.",
                Position = "Kıdemli Full Stack Geliştirici",
                StartDate = new DateTime(2022, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                EndDate = null,
                IsCurrent = true,
                Description = "Full-stack web uygulamaları geliştirme, takım liderliği ve mimari tasarım. Microservices mimarisi ile büyük ölçekli projeler yönetimi.",
                Technologies = "C#, .NET Core, Angular, TypeScript, PostgreSQL, Docker, Azure",
                DisplayOrder = 1
            },
            // EN
            new()
            {
                Company = "Tech Solutions Inc.",
                Position = "Senior Full Stack Developer",
                StartDate = new DateTime(2022, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                EndDate = null,
                IsCurrent = true,
                Description = "Full-stack web application development, team leadership, and architectural design. Management of large-scale projects with microservices architecture.",
                Technologies = "C#, .NET Core, Angular, TypeScript, PostgreSQL, Docker, Azure",
                DisplayOrder = 2
            }
        };

        await context.WorkExperiences.AddRangeAsync(experiences);
        await context.SaveChangesAsync();
    }

    private static async Task SeedEducationsAsync(ApplicationDbContext context)
    {
        if (await context.Educations.AnyAsync())
        {
            return;
        }

        var educations = new List<Education>
        {
            // TR
            new()
            {
                Institution = "Örnek Üniversite",
                Degree = "Lisans Derecesi",
                Field = "Bilgisayar Bilimleri",
                StartDate = new DateTime(2018, 9, 1, 0, 0, 0, DateTimeKind.Utc),
                EndDate = new DateTime(2022, 6, 1, 0, 0, 0, DateTimeKind.Utc),
                IsCompleted = true,
                Description = "Bilgisayar bilimleri alanında lisans eğitimi. Veri yapıları, algoritmalar, yazılım mühendisliği ve veritabanı yönetimi dersleri aldım.",
                DisplayOrder = 1
            },
            // EN
            new()
            {
                Institution = "Example University",
                Degree = "Bachelor's Degree",
                Field = "Computer Science",
                StartDate = new DateTime(2018, 9, 1, 0, 0, 0, DateTimeKind.Utc),
                EndDate = new DateTime(2022, 6, 1, 0, 0, 0, DateTimeKind.Utc),
                IsCompleted = true,
                Description = "Bachelor's degree in computer science. Took courses in data structures, algorithms, software engineering, and database management.",
                DisplayOrder = 2
            }
        };

        await context.Educations.AddRangeAsync(educations);
        await context.SaveChangesAsync();
    }
}
