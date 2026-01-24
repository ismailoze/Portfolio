using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Common;

namespace Portfolio.Infrastructure.Services;

/// <summary>
/// SMTP email service implementation
/// </summary>
public class SmtpEmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<SmtpEmailService> _logger;

    public SmtpEmailService(IConfiguration configuration, ILogger<SmtpEmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<Result> SendEmailAsync(string to, string subject, string body)
    {
        try
        {
            var smtpSettings = _configuration.GetSection("SmtpSettings");
            var smtpHost = smtpSettings["Host"];
            var smtpPort = int.Parse(smtpSettings["Port"] ?? "587");
            var smtpUser = smtpSettings["Username"];
            var smtpPassword = smtpSettings["Password"];
            var fromEmail = smtpSettings["FromEmail"];

            if (string.IsNullOrEmpty(smtpHost))
            {
                _logger.LogWarning("SMTP ayarları yapılandırılmamış. Email gönderilmedi.");
                return Result.Failure("Email servisi yapılandırılmamış.");
            }

            using var client = new System.Net.Mail.SmtpClient(smtpHost, smtpPort)
            {
                EnableSsl = true,
                Credentials = new System.Net.NetworkCredential(smtpUser, smtpPassword)
            };

            using var message = new System.Net.Mail.MailMessage(fromEmail ?? smtpUser!, to, subject, body)
            {
                IsBodyHtml = true
            };

            await client.SendMailAsync(message);
            _logger.LogInformation("Email başarıyla gönderildi: {To}", to);
            return Result.Success();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Email gönderilirken hata oluştu: {To}", to);
            return Result.Failure($"Email gönderilemedi: {ex.Message}");
        }
    }

    public async Task<Result> SendContactNotificationAsync(string name, string email, string subject, string message)
    {
        var adminEmail = _configuration["AdminEmail"] ?? "admin@portfolio.com";
        var body = $@"
            <h2>Yeni İletişim Mesajı</h2>
            <p><strong>İsim:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Konu:</strong> {subject}</p>
            <p><strong>Mesaj:</strong></p>
            <p>{message}</p>
        ";

        return await SendEmailAsync(adminEmail, $"Portfolio - Yeni İletişim: {subject}", body);
    }

    public async Task<Result> SendContactReplyAsync(string to, string originalSubject, string originalMessage, string replyMessage)
    {
        var body = $@"
            <h2>Mesajınıza Cevap</h2>
            <p>Merhaba,</p>
            <p>Aşağıda gönderdiğiniz mesaja cevabımız bulunmaktadır:</p>
            <hr>
            <h3>Orijinal Mesajınız:</h3>
            <p><strong>Konu:</strong> {originalSubject}</p>
            <p><strong>Mesajınız:</strong></p>
            <p>{originalMessage}</p>
            <hr>
            <h3>Cevabımız:</h3>
            <p>{replyMessage}</p>
            <hr>
            <p>Saygılarımızla,<br>Portfolio Ekibi</p>
        ";

        var replySubject = $"Re: {originalSubject}";
        return await SendEmailAsync(to, replySubject, body);
    }
}
