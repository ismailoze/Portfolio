using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Portfolio.Application.DTOs;
using Portfolio.Application.Interfaces;
using Portfolio.Application.Resources;
using Portfolio.Domain.Common;
using Portfolio.Domain.Entities;
using Portfolio.Infrastructure.Data;

namespace Portfolio.Infrastructure.Services;

public class BlogPostService : IBlogPostService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IStringLocalizer<SharedResource> _localizer;

    public BlogPostService(
        ApplicationDbContext context,
        IMapper mapper,
        IStringLocalizer<SharedResource> localizer)
    {
        _context = context;
        _mapper = mapper;
        _localizer = localizer;
    }

    public async Task<Result<IEnumerable<BlogPostDto>>> GetPublishedPostsAsync()
    {
        var posts = await _context.BlogPosts
            .Include(bp => bp.Translations)
            .Where(bp => bp.IsPublished)
            .OrderByDescending(bp => bp.PublishedAt ?? bp.CreatedAt)
            .ToListAsync();

        return Result.Success(_mapper.Map<IEnumerable<BlogPostDto>>(posts));
    }

    public async Task<Result<IEnumerable<BlogPostDto>>> GetAllPostsAsync()
    {
        var posts = await _context.BlogPosts
            .Include(bp => bp.Translations)
            .OrderByDescending(bp => bp.CreatedAt)
            .ToListAsync();

        return Result.Success(_mapper.Map<IEnumerable<BlogPostDto>>(posts));
    }

    public async Task<Result<BlogPostDto>> GetPostBySlugAsync(string slug)
    {
        // Slug artık translation'da, tüm translation'ları kontrol et
        var translation = await _context.BlogPostTranslations
            .Include(t => t.BlogPost)
            .ThenInclude(bp => bp!.Translations)
            .FirstOrDefaultAsync(t => t.Slug == slug);

        if (translation == null || translation.BlogPost == null)
            return Result.Failure<BlogPostDto>(_localizer["BlogPost_NotFound"]);

        return Result.Success(_mapper.Map<BlogPostDto>(translation.BlogPost));
    }

    public async Task<Result<BlogPostDto>> GetPostByIdAsync(Guid id)
    {
        var post = await _context.BlogPosts
            .Include(bp => bp.Translations)
            .FirstOrDefaultAsync(bp => bp.Id == id);
        
        if (post == null)
            return Result.Failure<BlogPostDto>(_localizer["BlogPost_NotFound"]);

        return Result.Success(_mapper.Map<BlogPostDto>(post));
    }

    public async Task<Result<BlogPostDto>> CreatePostAsync(CreateBlogPostDto dto)
    {
        // Blog post oluştur (ortak alanlar)
        var post = new BlogPost
        {
            PublishedAt = dto.PublishedAt,
            IsPublished = dto.IsPublished,
            FeaturedImageUrl = dto.FeaturedImageUrl
        };

        if (post.IsPublished && !post.PublishedAt.HasValue)
            post.PublishedAt = DateTime.UtcNow;

        _context.BlogPosts.Add(post);
        await _context.SaveChangesAsync();

        // Translation'ları ekle
        foreach (var translationDto in dto.Translations)
        {
            var translation = new BlogPostTranslation
            {
                BlogPostId = post.Id,
                LanguageCode = translationDto.LanguageCode,
                Title = translationDto.Title,
                Content = translationDto.Content,
                Excerpt = translationDto.Excerpt,
                Slug = translationDto.Slug
            };
            _context.BlogPostTranslations.Add(translation);
        }

        await _context.SaveChangesAsync();

        // Translation'ları include ederek tekrar yükle
        var resultPost = await _context.BlogPosts
            .Include(bp => bp.Translations)
            .FirstOrDefaultAsync(bp => bp.Id == post.Id);

        var resultDto = _mapper.Map<BlogPostDto>(resultPost);
        return Result.Success(resultDto);
    }

    public async Task<Result<BlogPostDto>> UpdatePostAsync(Guid id, UpdateBlogPostDto dto)
    {
        var post = await _context.BlogPosts
            .Include(bp => bp.Translations)
            .FirstOrDefaultAsync(bp => bp.Id == id);
        
        if (post == null)
            return Result.Failure<BlogPostDto>(_localizer["BlogPost_NotFound"]);

        // Ortak alanları güncelle
        post.PublishedAt = dto.PublishedAt;
        post.IsPublished = dto.IsPublished;
        post.FeaturedImageUrl = dto.FeaturedImageUrl;
        post.UpdatedAt = DateTime.UtcNow;
        
        if (post.IsPublished && !post.PublishedAt.HasValue)
            post.PublishedAt = DateTime.UtcNow;

        // Mevcut translation'ları güncelle veya yeni ekle
        foreach (var translationDto in dto.Translations)
        {
            var existingTranslation = post.Translations
                .FirstOrDefault(t => t.LanguageCode == translationDto.LanguageCode);

            if (existingTranslation != null)
            {
                // Mevcut translation'ı güncelle
                existingTranslation.Title = translationDto.Title;
                existingTranslation.Content = translationDto.Content;
                existingTranslation.Excerpt = translationDto.Excerpt;
                existingTranslation.Slug = translationDto.Slug;
                existingTranslation.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                // Yeni translation ekle
                var newTranslation = new BlogPostTranslation
                {
                    BlogPostId = post.Id,
                    LanguageCode = translationDto.LanguageCode,
                    Title = translationDto.Title,
                    Content = translationDto.Content,
                    Excerpt = translationDto.Excerpt,
                    Slug = translationDto.Slug
                };
                _context.BlogPostTranslations.Add(newTranslation);
            }
        }

        await _context.SaveChangesAsync();

        // Translation'ları include ederek tekrar yükle
        var updatedPost = await _context.BlogPosts
            .Include(bp => bp.Translations)
            .FirstOrDefaultAsync(bp => bp.Id == post.Id);

        var resultDto = _mapper.Map<BlogPostDto>(updatedPost);
        return Result.Success(resultDto);
    }

    public async Task<Result> DeletePostAsync(Guid id)
    {
        var post = await _context.BlogPosts.FindAsync(id);
        if (post == null)
            return Result.Failure(_localizer["BlogPost_NotFound"]);

        _context.BlogPosts.Remove(post);
        await _context.SaveChangesAsync();
        return Result.Success();
    }
}
