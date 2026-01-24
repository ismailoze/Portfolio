namespace Portfolio.Application.DTOs;

public record ProjectTranslationDto(
    Guid Id,
    Guid ProjectId,
    string LanguageCode,
    string Title,
    string Description,
    string? Technologies
);

public record CreateProjectTranslationDto(
    string LanguageCode,
    string Title,
    string Description,
    string? Technologies
);

public record UpdateProjectTranslationDto(
    string LanguageCode,
    string Title,
    string Description,
    string? Technologies
);
