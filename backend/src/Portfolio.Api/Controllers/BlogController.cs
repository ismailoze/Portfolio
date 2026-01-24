using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.DTOs;
using Portfolio.Application.Interfaces;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlogController : ControllerBase
{
    private readonly IBlogPostService _blogPostService;

    public BlogController(IBlogPostService blogPostService)
    {
        _blogPostService = blogPostService;
    }

    [HttpGet]
    public async Task<IActionResult> GetPublishedPosts()
    {
        var result = await _blogPostService.GetPublishedPostsAsync();
        if (result.IsFailure)
            return BadRequest(new { error = result.Error });

        return Ok(result.Value);
    }

    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllPosts()
    {
        var result = await _blogPostService.GetAllPostsAsync();
        if (result.IsFailure)
            return BadRequest(new { error = result.Error });

        return Ok(result.Value);
    }

    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetPostBySlug(string slug)
    {
        var result = await _blogPostService.GetPostBySlugAsync(slug);
        if (result.IsFailure)
            return NotFound(new { error = result.Error });

        return Ok(result.Value);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPost(Guid id)
    {
        var result = await _blogPostService.GetPostByIdAsync(id);
        if (result.IsFailure)
            return NotFound(new { error = result.Error });

        return Ok(result.Value);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreatePost([FromBody] CreateBlogPostDto dto)
    {
        var result = await _blogPostService.CreatePostAsync(dto);
        if (result.IsFailure)
            return BadRequest(new { error = result.Error });

        return CreatedAtAction(nameof(GetPost), new { id = result.Value.Id }, result.Value);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdatePost(Guid id, [FromBody] UpdateBlogPostDto dto)
    {
        var result = await _blogPostService.UpdatePostAsync(id, dto);
        if (result.IsFailure)
            return BadRequest(new { error = result.Error });

        return Ok(result.Value);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeletePost(Guid id)
    {
        var result = await _blogPostService.DeletePostAsync(id);
        if (result.IsFailure)
            return BadRequest(new { error = result.Error });

        return NoContent();
    }
}
