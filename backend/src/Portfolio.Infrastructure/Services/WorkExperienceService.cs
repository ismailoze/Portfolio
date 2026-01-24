using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.DTOs;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Common;
using Portfolio.Infrastructure.Data;

namespace Portfolio.Infrastructure.Services;

public class WorkExperienceService : IWorkExperienceService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public WorkExperienceService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<WorkExperienceDto>>> GetExperiencesAsync()
    {
        var experiences = await _context.WorkExperiences
            .OrderByDescending(e => e.StartDate)
            .ToListAsync();

        return Result.Success(_mapper.Map<IEnumerable<WorkExperienceDto>>(experiences));
    }

    public async Task<Result<WorkExperienceDto>> GetExperienceByIdAsync(Guid id)
    {
        var experience = await _context.WorkExperiences.FindAsync(id);
        if (experience == null)
            return Result.Failure<WorkExperienceDto>("İş deneyimi bulunamadı.");

        return Result.Success(_mapper.Map<WorkExperienceDto>(experience));
    }

    public async Task<Result<WorkExperienceDto>> CreateExperienceAsync(CreateWorkExperienceDto dto)
    {
        var experience = _mapper.Map<Domain.Entities.WorkExperience>(dto);
        _context.WorkExperiences.Add(experience);
        await _context.SaveChangesAsync();

        return Result.Success(_mapper.Map<WorkExperienceDto>(experience));
    }

    public async Task<Result<WorkExperienceDto>> UpdateExperienceAsync(Guid id, UpdateWorkExperienceDto dto)
    {
        var experience = await _context.WorkExperiences.FindAsync(id);
        if (experience == null)
            return Result.Failure<WorkExperienceDto>("İş deneyimi bulunamadı.");

        _mapper.Map(dto, experience);
        experience.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Result.Success(_mapper.Map<WorkExperienceDto>(experience));
    }

    public async Task<Result> DeleteExperienceAsync(Guid id)
    {
        var experience = await _context.WorkExperiences.FindAsync(id);
        if (experience == null)
            return Result.Failure("İş deneyimi bulunamadı.");

        _context.WorkExperiences.Remove(experience);
        await _context.SaveChangesAsync();
        return Result.Success();
    }
}
