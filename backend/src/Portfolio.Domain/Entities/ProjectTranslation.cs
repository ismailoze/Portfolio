using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

/// <summary>
/// Proje çevirileri entity
/// </summary>
public class ProjectTranslation : BaseEntity
{
    public Guid ProjectId { get; set; }
    public string LanguageCode { get; set; } = string.Empty; // "tr" veya "en"
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Technologies { get; set; }

    // Navigation property
    public virtual Project Project { get; set; } = null!;
}
