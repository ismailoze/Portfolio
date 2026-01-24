using Portfolio.Application.DTOs;
using Portfolio.Domain.Common;

namespace Portfolio.Application.Interfaces;

public interface IEducationService
{
    Task<Result<IEnumerable<EducationDto>>> GetEducationsAsync();
    Task<Result<EducationDto>> GetEducationByIdAsync(Guid id);
    Task<Result<EducationDto>> CreateEducationAsync(CreateEducationDto dto);
    Task<Result<EducationDto>> UpdateEducationAsync(Guid id, UpdateEducationDto dto);
    Task<Result> DeleteEducationAsync(Guid id);
}
