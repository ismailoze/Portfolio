using Portfolio.Domain.Common;

namespace Portfolio.Application.Interfaces;

public interface IEmailService
{
    Task<Result> SendEmailAsync(string to, string subject, string body);
    Task<Result> SendContactNotificationAsync(string name, string email, string subject, string message);
    Task<Result> SendContactReplyAsync(string to, string originalSubject, string originalMessage, string replyMessage);
}
