using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var stats = new
        {
            TotalProjects = await _context.Projects.CountAsync(),
            PublishedProjects = await _context.Projects.CountAsync(p => p.IsPublished),
            TotalBlogPosts = await _context.BlogPosts.CountAsync(),
            PublishedBlogPosts = await _context.BlogPosts.CountAsync(bp => bp.IsPublished),
            TotalSkills = await _context.Skills.CountAsync(),
            TotalExperiences = await _context.WorkExperiences.CountAsync(),
            TotalEducations = await _context.Educations.CountAsync(),
            UnreadMessages = await _context.ContactMessages.CountAsync(m => !m.IsRead),
            TotalMessages = await _context.ContactMessages.CountAsync()
        };

        return Ok(stats);
    }
}
