namespace Portfolio.Application.DTOs;

public record EducationDto(
    Guid Id,
    string Institution,
    string Degree,
    string Field,
    DateTime StartDate,
    DateTime? EndDate,
    string? Description,
    bool IsCompleted,
    int DisplayOrder,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record CreateEducationDto(
    string Institution,
    string Degree,
    string Field,
    DateTime StartDate,
    DateTime? EndDate,
    string? Description,
    bool IsCompleted = true,
    int DisplayOrder = 0
);

public record UpdateEducationDto(
    string Institution,
    string Degree,
    string Field,
    DateTime StartDate,
    DateTime? EndDate,
    string? Description,
    bool IsCompleted,
    int DisplayOrder
);
