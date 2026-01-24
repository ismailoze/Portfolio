using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

/// <summary>
/// Blog yazısı entity
/// </summary>
public class BlogPost : BaseEntity
{
    public DateTime? PublishedAt { get; set; }
    public bool IsPublished { get; set; } = false;
    public string? FeaturedImageUrl { get; set; }

    // Navigation properties
    public virtual ICollection<BlogPostTranslation> Translations { get; set; } = new List<BlogPostTranslation>();
}
