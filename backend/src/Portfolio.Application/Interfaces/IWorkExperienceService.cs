using Portfolio.Application.DTOs;
using Portfolio.Domain.Common;

namespace Portfolio.Application.Interfaces;

public interface IWorkExperienceService
{
    Task<Result<IEnumerable<WorkExperienceDto>>> GetExperiencesAsync();
    Task<Result<WorkExperienceDto>> GetExperienceByIdAsync(Guid id);
    Task<Result<WorkExperienceDto>> CreateExperienceAsync(CreateWorkExperienceDto dto);
    Task<Result<WorkExperienceDto>> UpdateExperienceAsync(Guid id, UpdateWorkExperienceDto dto);
    Task<Result> DeleteExperienceAsync(Guid id);
}
