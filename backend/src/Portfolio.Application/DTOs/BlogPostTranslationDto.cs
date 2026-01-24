namespace Portfolio.Application.DTOs;

public record BlogPostTranslationDto(
    Guid Id,
    Guid BlogPostId,
    string LanguageCode,
    string Title,
    string Content,
    string Excerpt,
    string Slug
);

public record CreateBlogPostTranslationDto(
    string LanguageCode,
    string Title,
    string Content,
    string Excerpt,
    string Slug
);

public record UpdateBlogPostTranslationDto(
    string LanguageCode,
    string Title,
    string Content,
    string Excerpt,
    string Slug
);
