using Portfolio.Application.DTOs;
using Portfolio.Domain.Common;

namespace Portfolio.Application.Interfaces;

public interface ISkillService
{
    Task<Result<IEnumerable<SkillDto>>> GetSkillsAsync();
    Task<Result<IEnumerable<SkillDto>>> GetSkillsByCategoryAsync(string category);
    Task<Result<SkillDto>> GetSkillByIdAsync(Guid id);
    Task<Result<SkillDto>> CreateSkillAsync(CreateSkillDto dto);
    Task<Result<SkillDto>> UpdateSkillAsync(Guid id, UpdateSkillDto dto);
    Task<Result> DeleteSkillAsync(Guid id);
}
