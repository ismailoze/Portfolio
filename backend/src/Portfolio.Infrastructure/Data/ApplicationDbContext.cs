using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Portfolio.Domain.Entities;

namespace Portfolio.Infrastructure.Data;

/// <summary>
/// EF Core DbContext - Identity ve custom entity'ler için
/// </summary>
public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Project> Projects { get; set; }
    public DbSet<BlogPost> BlogPosts { get; set; }
    public DbSet<WorkExperience> WorkExperiences { get; set; }
    public DbSet<Education> Educations { get; set; }
    public DbSet<Skill> Skills { get; set; }
    public DbSet<ContactMessage> ContactMessages { get; set; }
    public DbSet<ProjectTranslation> ProjectTranslations { get; set; }
    public DbSet<BlogPostTranslation> BlogPostTranslations { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Kullanılmayan Identity tablolarını kaldır
        // Bu tablolar projede kullanılmıyor: UserClaims, RoleClaims, UserLogins, UserTokens
        // Migration ile kaldırıldı, burada entity mapping'lerini de kaldırıyoruz
        // Not: Ignore metodu uyarı verebilir ama migration zaten tabloları kaldırdığı için sorun yok
        builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserClaim<string>>().ToTable((string?)null);
        builder.Entity<Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>>().ToTable((string?)null);
        builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserLogin<string>>().ToTable((string?)null);
        builder.Entity<Microsoft.AspNetCore.Identity.IdentityUserToken<string>>().ToTable((string?)null);

        // Indexes
        builder.Entity<Project>()
            .HasIndex(p => new { p.IsPublished, p.DisplayOrder });

        builder.Entity<Skill>()
            .HasIndex(s => s.Category);

        // ProjectTranslation unique constraint (ProjectId + LanguageCode)
        builder.Entity<ProjectTranslation>()
            .HasIndex(pt => new { pt.ProjectId, pt.LanguageCode })
            .IsUnique();

        // BlogPostTranslation unique constraint (BlogPostId + LanguageCode)
        builder.Entity<BlogPostTranslation>()
            .HasIndex(bpt => new { bpt.BlogPostId, bpt.LanguageCode })
            .IsUnique();

        // BlogPostTranslation slug unique per language
        builder.Entity<BlogPostTranslation>()
            .HasIndex(bpt => new { bpt.Slug, bpt.LanguageCode })
            .IsUnique();
    }
}
