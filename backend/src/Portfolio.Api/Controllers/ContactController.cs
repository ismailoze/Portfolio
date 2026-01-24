using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.DTOs;
using Portfolio.Application.Interfaces;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly IContactService _contactService;

    public ContactController(IContactService contactService)
    {
        _contactService = contactService;
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] CreateContactMessageDto dto)
    {
        var result = await _contactService.CreateMessageAsync(dto);
        if (result.IsFailure)
            return BadRequest(new { error = result.Error });

        return CreatedAtAction(nameof(GetMessage), new { id = result.Value.Id }, result.Value);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllMessages()
    {
        var result = await _contactService.GetAllMessagesAsync();
        if (result.IsFailure)
            return BadRequest(new { error = result.Error });

        return Ok(result.Value);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetMessage(Guid id)
    {
        var result = await _contactService.GetMessageByIdAsync(id);
        if (result.IsFailure)
            return NotFound(new { error = result.Error });

        return Ok(result.Value);
    }

    [HttpPut("{id}/read")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var result = await _contactService.MarkAsReadAsync(id);
        if (result.IsFailure)
            return BadRequest(new { error = result.Error });

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteMessage(Guid id)
    {
        var result = await _contactService.DeleteMessageAsync(id);
        if (result.IsFailure)
            return BadRequest(new { error = result.Error });

        return NoContent();
    }

    [HttpPost("{id}/reply")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ReplyToMessage(Guid id, [FromBody] ReplyContactMessageDto dto)
    {
        var result = await _contactService.ReplyToMessageAsync(id, dto);
        if (result.IsFailure)
            return BadRequest(new { error = result.Error });

        return NoContent();
    }
}
