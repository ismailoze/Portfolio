using Portfolio.Application.DTOs;
using Portfolio.Domain.Common;

namespace Portfolio.Application.Interfaces;

public interface IProjectService
{
    Task<Result<IEnumerable<ProjectDto>>> GetPublishedProjectsAsync();
    Task<Result<IEnumerable<ProjectDto>>> GetAllProjectsAsync();
    Task<Result<ProjectDto>> GetProjectByIdAsync(Guid id);
    Task<Result<ProjectDto>> CreateProjectAsync(CreateProjectDto dto);
    Task<Result<ProjectDto>> UpdateProjectAsync(Guid id, UpdateProjectDto dto);
    Task<Result> DeleteProjectAsync(Guid id);
}
