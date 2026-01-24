using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

/// <summary>
/// İş deneyimi entity
/// </summary>
public class WorkExperience : BaseEntity
{
    public string Company { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? Technologies { get; set; }
    public bool IsCurrent { get; set; } = false;
    public int DisplayOrder { get; set; } = 0;
}
