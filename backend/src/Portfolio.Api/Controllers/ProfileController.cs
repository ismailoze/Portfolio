using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Portfolio.Infrastructure.Data;

namespace Portfolio.Api.Controllers;

/// <summary>
/// Portfolio sahibinin bilgilerini döndüren controller
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ProfileController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public ProfileController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    /// <summary>
    /// Portfolio sahibinin (Admin kullanıcının) adı soyadını döndürür
    /// </summary>
    [HttpGet("owner")]
    public async Task<IActionResult> GetPortfolioOwner()
    {
        // Admin rolündeki kullanıcıyı bul
        var adminUsers = await _userManager.GetUsersInRoleAsync("Admin");
        var adminUser = adminUsers.FirstOrDefault();

        if (adminUser == null)
        {
            return NotFound(new { error = "Portfolio owner not found" });
        }

        return Ok(new
        {
            firstName = adminUser.FirstName,
            lastName = adminUser.LastName
        });
    }
}
