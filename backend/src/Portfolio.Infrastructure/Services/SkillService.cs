using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.DTOs;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Common;
using Portfolio.Infrastructure.Data;

namespace Portfolio.Infrastructure.Services;

public class SkillService : ISkillService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public SkillService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<SkillDto>>> GetSkillsAsync()
    {
        var skills = await _context.Skills
            .OrderBy(s => s.Category)
            .ThenBy(s => s.DisplayOrder)
            .ToListAsync();

        return Result.Success(_mapper.Map<IEnumerable<SkillDto>>(skills));
    }

    public async Task<Result<IEnumerable<SkillDto>>> GetSkillsByCategoryAsync(string category)
    {
        var skills = await _context.Skills
            .Where(s => s.Category == category)
            .OrderBy(s => s.DisplayOrder)
            .ToListAsync();

        return Result.Success(_mapper.Map<IEnumerable<SkillDto>>(skills));
    }

    public async Task<Result<SkillDto>> GetSkillByIdAsync(Guid id)
    {
        var skill = await _context.Skills.FindAsync(id);
        if (skill == null)
            return Result.Failure<SkillDto>("Yetenek bulunamadı.");

        return Result.Success(_mapper.Map<SkillDto>(skill));
    }

    public async Task<Result<SkillDto>> CreateSkillAsync(CreateSkillDto dto)
    {
        var skill = _mapper.Map<Domain.Entities.Skill>(dto);
        _context.Skills.Add(skill);
        await _context.SaveChangesAsync();

        return Result.Success(_mapper.Map<SkillDto>(skill));
    }

    public async Task<Result<SkillDto>> UpdateSkillAsync(Guid id, UpdateSkillDto dto)
    {
        var skill = await _context.Skills.FindAsync(id);
        if (skill == null)
            return Result.Failure<SkillDto>("Yetenek bulunamadı.");

        _mapper.Map(dto, skill);
        skill.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Result.Success(_mapper.Map<SkillDto>(skill));
    }

    public async Task<Result> DeleteSkillAsync(Guid id)
    {
        var skill = await _context.Skills.FindAsync(id);
        if (skill == null)
            return Result.Failure("Yetenek bulunamadı.");

        _context.Skills.Remove(skill);
        await _context.SaveChangesAsync();
        return Result.Success();
    }
}
