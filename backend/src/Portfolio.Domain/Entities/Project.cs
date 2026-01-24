using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

/// <summary>
/// Portfolio projesi entity
/// </summary>
public class Project : BaseEntity
{
    public string? GitHubUrl { get; set; }
    public string? LiveUrl { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsPublished { get; set; } = false;
    public int DisplayOrder { get; set; } = 0;

    // Navigation properties
    public virtual ICollection<ProjectTranslation> Translations { get; set; } = new List<ProjectTranslation>();
}
