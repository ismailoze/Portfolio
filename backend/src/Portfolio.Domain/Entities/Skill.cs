using Portfolio.Domain.Common;

namespace Portfolio.Domain.Entities;

/// <summary>
/// Yetenek entity
/// </summary>
public class Skill : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // Frontend, Backend, Database, DevOps, etc.
    public int Level { get; set; } = 1; // 1-5 arası
    public string? Icon { get; set; }
    public int DisplayOrder { get; set; } = 0;

}
