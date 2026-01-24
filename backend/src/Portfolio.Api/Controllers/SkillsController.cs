using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.DTOs;
using Portfolio.Application.Interfaces;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SkillsController : ControllerBase
{
    private readonly ISkillService _skillService;

    public SkillsController(ISkillService skillService)
    {
        _skillService = skillService;
    }

    [HttpGet]
    public async Task<IActionResult> GetSkills([FromQuery] string? category = null)
    {
        var result = category == null
            ? await _skillService.GetSkillsAsync()
            : await _skillService.GetSkillsByCategoryAsync(category);

        if (result.IsFailure)
            return BadRequest(new { error = result.Error });

        return Ok(result.Value);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSkill(Guid id)
    {
        var result = await _skillService.GetSkillByIdAsync(id);
        if (result.IsFailure)
            return NotFound(new { error = result.Error });

        return Ok(result.Value);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateSkill([FromBody] CreateSkillDto dto)
    {
        var result = await _skillService.CreateSkillAsync(dto);
        if (result.IsFailure)
            return BadRequest(new { error = result.Error });

        return CreatedAtAction(nameof(GetSkill), new { id = result.Value.Id }, result.Value);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateSkill(Guid id, [FromBody] UpdateSkillDto dto)
    {
        var result = await _skillService.UpdateSkillAsync(id, dto);
        if (result.IsFailure)
            return BadRequest(new { error = result.Error });

        return Ok(result.Value);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteSkill(Guid id)
    {
        var result = await _skillService.DeleteSkillAsync(id);
        if (result.IsFailure)
            return BadRequest(new { error = result.Error });

        return NoContent();
    }
}
