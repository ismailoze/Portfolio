using Portfolio.Application.DTOs;
using Portfolio.Domain.Common;

namespace Portfolio.Application.Interfaces;

public interface IContactService
{
    Task<Result<ContactMessageDto>> CreateMessageAsync(CreateContactMessageDto dto);
    Task<Result<IEnumerable<ContactMessageDto>>> GetAllMessagesAsync();
    Task<Result<ContactMessageDto>> GetMessageByIdAsync(Guid id);
    Task<Result> MarkAsReadAsync(Guid id);
    Task<Result> DeleteMessageAsync(Guid id);
    Task<Result> ReplyToMessageAsync(Guid id, ReplyContactMessageDto dto);
}
