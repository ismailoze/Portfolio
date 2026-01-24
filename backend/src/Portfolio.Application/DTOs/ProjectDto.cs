namespace Portfolio.Application.DTOs;

public record ProjectDto(
    Guid Id,
    string? GitHubUrl,
    string? LiveUrl,
    string? ImageUrl,
    bool IsPublished,
    int DisplayOrder,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    IEnumerable<ProjectTranslationDto>? Translations = null
);

public record CreateProjectDto(
    IEnumerable<CreateProjectTranslationDto> Translations,
    string? GitHubUrl,
    string? LiveUrl,
    string? ImageUrl,
    bool IsPublished = false,
    int DisplayOrder = 0
);

public record UpdateProjectDto(
    IEnumerable<UpdateProjectTranslationDto> Translations,
    string? GitHubUrl,
    string? LiveUrl,
    string? ImageUrl,
    bool IsPublished,
    int DisplayOrder
);
