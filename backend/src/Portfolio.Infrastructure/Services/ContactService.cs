using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Portfolio.Application.Resources;
using Portfolio.Application.DTOs;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Common;
using Portfolio.Infrastructure.Data;

namespace Portfolio.Infrastructure.Services;

public class ContactService : IContactService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IEmailService _emailService;
    private readonly TurnstileService _turnstileService;
    private readonly IStringLocalizer<SharedResource> _localizer;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ContactService(
        ApplicationDbContext context,
        IMapper mapper,
        IEmailService emailService,
        TurnstileService turnstileService,
        IStringLocalizer<SharedResource> localizer,
        IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _mapper = mapper;
        _emailService = emailService;
        _turnstileService = turnstileService;
        _localizer = localizer;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<Result<ContactMessageDto>> CreateMessageAsync(CreateContactMessageDto dto)
    {
        // Turnstile token doğrulaması
        if (!string.IsNullOrWhiteSpace(dto.TurnstileToken))
        {
            var remoteIp = _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString();
            var isValidTurnstile = await _turnstileService.VerifyTokenAsync(dto.TurnstileToken, remoteIp);

            if (!isValidTurnstile)
            {
                return Result.Failure<ContactMessageDto>(_localizer["Contact_TurnstileVerificationFailed"]);
            }
        }

        var message = _mapper.Map<Domain.Entities.ContactMessage>(dto);
        _context.ContactMessages.Add(message);
        await _context.SaveChangesAsync();

        // Email bildirimi gönder (hata olsa bile mesaj kaydedildi)
        _ = Task.Run(async () =>
        {
            await _emailService.SendContactNotificationAsync(
                dto.Name,
                dto.Email,
                dto.Subject,
                dto.Message
            );
        });

        return Result.Success(_mapper.Map<ContactMessageDto>(message));
    }

    public async Task<Result<IEnumerable<ContactMessageDto>>> GetAllMessagesAsync()
    {
        var messages = await _context.ContactMessages
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();

        return Result.Success(_mapper.Map<IEnumerable<ContactMessageDto>>(messages));
    }

    public async Task<Result<ContactMessageDto>> GetMessageByIdAsync(Guid id)
    {
        var message = await _context.ContactMessages.FindAsync(id);
        if (message == null)
            return Result.Failure<ContactMessageDto>(_localizer["Contact_MessageNotFound"]);

        return Result.Success(_mapper.Map<ContactMessageDto>(message));
    }

    public async Task<Result> MarkAsReadAsync(Guid id)
    {
        var message = await _context.ContactMessages.FindAsync(id);
        if (message == null)
            return Result.Failure(_localizer["Contact_MessageNotFound"]);

        message.IsRead = true;
        message.ReadAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Result.Success();
    }

    public async Task<Result> DeleteMessageAsync(Guid id)
    {
        var message = await _context.ContactMessages.FindAsync(id);
        if (message == null)
            return Result.Failure(_localizer["Contact_MessageNotFound"]);

        _context.ContactMessages.Remove(message);
        await _context.SaveChangesAsync();

        return Result.Success();
    }

    public async Task<Result> ReplyToMessageAsync(Guid id, ReplyContactMessageDto dto)
    {
        var message = await _context.ContactMessages.FindAsync(id);
        if (message == null)
            return Result.Failure(_localizer["Contact_MessageNotFound"]);

        // Email gönder (hata olsa bile işlem tamamlandı olarak işaretlenir)
        _ = Task.Run(async () =>
        {
            await _emailService.SendContactReplyAsync(
                message.Email,
                message.Subject,
                message.Message,
                dto.ReplyMessage
            );
        });

        return Result.Success();
    }
}
