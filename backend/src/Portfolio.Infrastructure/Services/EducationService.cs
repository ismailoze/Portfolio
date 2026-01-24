using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.DTOs;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Common;
using Portfolio.Infrastructure.Data;

namespace Portfolio.Infrastructure.Services;

public class EducationService : IEducationService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public EducationService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<EducationDto>>> GetEducationsAsync()
    {
        var educations = await _context.Educations
            .OrderByDescending(e => e.StartDate)
            .ToListAsync();

        return Result.Success(_mapper.Map<IEnumerable<EducationDto>>(educations));
    }

    public async Task<Result<EducationDto>> GetEducationByIdAsync(Guid id)
    {
        var education = await _context.Educations.FindAsync(id);
        if (education == null)
            return Result.Failure<EducationDto>("Eğitim bilgisi bulunamadı.");

        return Result.Success(_mapper.Map<EducationDto>(education));
    }

    public async Task<Result<EducationDto>> CreateEducationAsync(CreateEducationDto dto)
    {
        var education = _mapper.Map<Domain.Entities.Education>(dto);
        _context.Educations.Add(education);
        await _context.SaveChangesAsync();

        return Result.Success(_mapper.Map<EducationDto>(education));
    }

    public async Task<Result<EducationDto>> UpdateEducationAsync(Guid id, UpdateEducationDto dto)
    {
        var education = await _context.Educations.FindAsync(id);
        if (education == null)
            return Result.Failure<EducationDto>("Eğitim bilgisi bulunamadı.");

        _mapper.Map(dto, education);
        education.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Result.Success(_mapper.Map<EducationDto>(education));
    }

    public async Task<Result> DeleteEducationAsync(Guid id)
    {
        var education = await _context.Educations.FindAsync(id);
        if (education == null)
            return Result.Failure("Eğitim bilgisi bulunamadı.");

        _context.Educations.Remove(education);
        await _context.SaveChangesAsync();
        return Result.Success();
    }
}
