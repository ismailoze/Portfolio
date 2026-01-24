namespace Portfolio.Application.DTOs;

public record SkillDto(
    Guid Id,
    string Name,
    string Category,
    int Level,
    string? Icon,
    int DisplayOrder,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record CreateSkillDto(
    string Name,
    string Category,
    int Level,
    string? Icon,
    int DisplayOrder = 0
);

public record UpdateSkillDto(
    string Name,
    string Category,
    int Level,
    string? Icon,
    int DisplayOrder
);
