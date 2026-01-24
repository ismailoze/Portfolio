using Microsoft.AspNetCore.Identity;

namespace Portfolio.Infrastructure.Data;

/// <summary>
/// Identity User entity - Extend edilebilir
/// </summary>
public class ApplicationUser : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
