namespace Portfolio.Application.DTOs;

public record BlogPostDto(
    Guid Id,
    DateTime? PublishedAt,
    bool IsPublished,
    string? FeaturedImageUrl,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    IEnumerable<BlogPostTranslationDto>? Translations = null
);

public record CreateBlogPostDto(
    IEnumerable<CreateBlogPostTranslationDto> Translations,
    DateTime? PublishedAt,
    bool IsPublished = false,
    string? FeaturedImageUrl = null
);

public record UpdateBlogPostDto(
    IEnumerable<UpdateBlogPostTranslationDto> Translations,
    DateTime? PublishedAt,
    bool IsPublished,
    string? FeaturedImageUrl
);
