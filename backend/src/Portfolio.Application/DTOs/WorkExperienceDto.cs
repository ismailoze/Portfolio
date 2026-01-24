namespace Portfolio.Application.DTOs;

public record WorkExperienceDto(
    Guid Id,
    string Company,
    string Position,
    DateTime StartDate,
    DateTime? EndDate,
    string Description,
    string? Technologies,
    bool IsCurrent,
    int DisplayOrder,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record CreateWorkExperienceDto(
    string Company,
    string Position,
    DateTime StartDate,
    DateTime? EndDate,
    string Description,
    string? Technologies,
    bool IsCurrent = false,
    int DisplayOrder = 0
);

public record UpdateWorkExperienceDto(
    string Company,
    string Position,
    DateTime StartDate,
    DateTime? EndDate,
    string Description,
    string? Technologies,
    bool IsCurrent,
    int DisplayOrder
);
