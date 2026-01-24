namespace Portfolio.Application.DTOs;

public record ContactMessageDto(
    Guid Id,
    string Name,
    string Email,
    string Subject,
    string Message,
    bool IsRead,
    DateTime? ReadAt,
    DateTime CreatedAt
);

public record CreateContactMessageDto(
    string Name,
    string Email,
    string Subject,
    string Message,
    string? TurnstileToken = null
);

public record ReplyContactMessageDto(
    string ReplyMessage
);
