using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.DTOs;
using Portfolio.Application.Interfaces;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EducationController : ControllerBase
{
    private readonly IEducationService _educationService;

    public EducationController(IEducationService educationService)
    {
        _educationService = educationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetEducations()
    {
        var result = await _educationService.GetEducationsAsync();
        if (result.IsFailure)
            return BadRequest(new { error = result.Error });

        return Ok(result.Value);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetEducation(Guid id)
    {
        var result = await _educationService.GetEducationByIdAsync(id);
        if (result.IsFailure)
            return NotFound(new { error = result.Error });

        return Ok(result.Value);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateEducation([FromBody] CreateEducationDto dto)
    {
        var result = await _educationService.CreateEducationAsync(dto);
        if (result.IsFailure)
            return BadRequest(new { error = result.Error });

        return CreatedAtAction(nameof(GetEducation), new { id = result.Value.Id }, result.Value);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateEducation(Guid id, [FromBody] UpdateEducationDto dto)
    {
        var result = await _educationService.UpdateEducationAsync(id, dto);
        if (result.IsFailure)
            return BadRequest(new { error = result.Error });

        return Ok(result.Value);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteEducation(Guid id)
    {
        var result = await _educationService.DeleteEducationAsync(id);
        if (result.IsFailure)
            return BadRequest(new { error = result.Error });

        return NoContent();
    }
}
