using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

/// <summary>
/// Eğitim bilgisi entity
/// </summary>
public class Education : BaseEntity
{
    public string Institution { get; set; } = string.Empty;
    public string Degree { get; set; } = string.Empty;
    public string Field { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Description { get; set; }
    public bool IsCompleted { get; set; } = true;
    public int DisplayOrder { get; set; } = 0;
}
