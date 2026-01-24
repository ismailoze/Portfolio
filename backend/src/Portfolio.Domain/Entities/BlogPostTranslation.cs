using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

/// <summary>
/// Blog yazısı çevirileri entity
/// </summary>
public class BlogPostTranslation : BaseEntity
{
    public Guid BlogPostId { get; set; }
    public string LanguageCode { get; set; } = string.Empty; // "tr" veya "en"
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Excerpt { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;

    // Navigation property
    public virtual BlogPost BlogPost { get; set; } = null!;
}
