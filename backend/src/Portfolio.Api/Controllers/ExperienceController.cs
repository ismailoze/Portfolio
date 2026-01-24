using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.DTOs;
using Portfolio.Application.Interfaces;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExperienceController : ControllerBase
{
    private readonly IWorkExperienceService _experienceService;

    public ExperienceController(IWorkExperienceService experienceService)
    {
        _experienceService = experienceService;
    }

    [HttpGet]
    public async Task<IActionResult> GetExperiences()
    {
        var result = await _experienceService.GetExperiencesAsync();
        if (result.IsFailure)
            return BadRequest(new { error = result.Error });

        return Ok(result.Value);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetExperience(Guid id)
    {
        var result = await _experienceService.GetExperienceByIdAsync(id);
        if (result.IsFailure)
            return NotFound(new { error = result.Error });

        return Ok(result.Value);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateExperience([FromBody] CreateWorkExperienceDto dto)
    {
        var result = await _experienceService.CreateExperienceAsync(dto);
        if (result.IsFailure)
            return BadRequest(new { error = result.Error });

        return CreatedAtAction(nameof(GetExperience), new { id = result.Value.Id }, result.Value);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateExperience(Guid id, [FromBody] UpdateWorkExperienceDto dto)
    {
        var result = await _experienceService.UpdateExperienceAsync(id, dto);
        if (result.IsFailure)
            return BadRequest(new { error = result.Error });

        return Ok(result.Value);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteExperience(Guid id)
    {
        var result = await _experienceService.DeleteExperienceAsync(id);
        if (result.IsFailure)
            return BadRequest(new { error = result.Error });

        return NoContent();
    }
}
