using Portfolio.Application.DTOs;
using Portfolio.Domain.Common;

namespace Portfolio.Application.Interfaces;

public interface IBlogPostService
{
    Task<Result<IEnumerable<BlogPostDto>>> GetPublishedPostsAsync();
    Task<Result<IEnumerable<BlogPostDto>>> GetAllPostsAsync();
    Task<Result<BlogPostDto>> GetPostBySlugAsync(string slug);
    Task<Result<BlogPostDto>> GetPostByIdAsync(Guid id);
    Task<Result<BlogPostDto>> CreatePostAsync(CreateBlogPostDto dto);
    Task<Result<BlogPostDto>> UpdatePostAsync(Guid id, UpdateBlogPostDto dto);
    Task<Result> DeletePostAsync(Guid id);
}
