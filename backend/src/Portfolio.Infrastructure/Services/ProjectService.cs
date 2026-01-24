using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Portfolio.Application.DTOs;
using Portfolio.Application.Interfaces;
using Portfolio.Application.Resources;
using Portfolio.Domain.Common;
using Portfolio.Domain.Entities;
using Portfolio.Infrastructure.Data;

namespace Portfolio.Infrastructure.Services;

public class ProjectService : IProjectService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IStringLocalizer<SharedResource> _localizer;

    public ProjectService(
        ApplicationDbContext context,
        IMapper mapper,
        IStringLocalizer<SharedResource> localizer)
    {
        _context = context;
        _mapper = mapper;
        _localizer = localizer;
    }

    public async Task<Result<IEnumerable<ProjectDto>>> GetPublishedProjectsAsync()
    {
        var projects = await _context.Projects
            .Include(p => p.Translations)
            .Where(p => p.IsPublished)
            .OrderBy(p => p.DisplayOrder)
            .ThenByDescending(p => p.CreatedAt)
            .ToListAsync();

        var dtos = _mapper.Map<IEnumerable<ProjectDto>>(projects);
        return Result.Success(dtos);
    }

    public async Task<Result<IEnumerable<ProjectDto>>> GetAllProjectsAsync()
    {
        var projects = await _context.Projects
            .Include(p => p.Translations)
            .OrderBy(p => p.DisplayOrder)
            .ThenByDescending(p => p.CreatedAt)
            .ToListAsync();

        var dtos = _mapper.Map<IEnumerable<ProjectDto>>(projects);
        return Result.Success(dtos);
    }

    public async Task<Result<ProjectDto>> GetProjectByIdAsync(Guid id)
    {
        var project = await _context.Projects
            .Include(p => p.Translations)
            .FirstOrDefaultAsync(p => p.Id == id);
        
        if (project == null)
            return Result.Failure<ProjectDto>(_localizer["Project_NotFound"]);

        var dto = _mapper.Map<ProjectDto>(project);
        return Result.Success(dto);
    }

    public async Task<Result<ProjectDto>> CreateProjectAsync(CreateProjectDto dto)
    {
        // Proje oluştur (ortak alanlar)
        var project = new Project
        {
            GitHubUrl = dto.GitHubUrl,
            LiveUrl = dto.LiveUrl,
            ImageUrl = dto.ImageUrl,
            IsPublished = dto.IsPublished,
            DisplayOrder = dto.DisplayOrder
        };

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        // Translation'ları ekle
        foreach (var translationDto in dto.Translations)
        {
            var translation = new ProjectTranslation
            {
                ProjectId = project.Id,
                LanguageCode = translationDto.LanguageCode,
                Title = translationDto.Title,
                Description = translationDto.Description,
                Technologies = translationDto.Technologies
            };
            _context.ProjectTranslations.Add(translation);
        }

        await _context.SaveChangesAsync();

        // Translation'ları include ederek tekrar yükle
        var resultProject = await _context.Projects
            .Include(p => p.Translations)
            .FirstOrDefaultAsync(p => p.Id == project.Id);

        var resultDto = _mapper.Map<ProjectDto>(resultProject);
        return Result.Success(resultDto);
    }

    public async Task<Result<ProjectDto>> UpdateProjectAsync(Guid id, UpdateProjectDto dto)
    {
        var project = await _context.Projects
            .Include(p => p.Translations)
            .FirstOrDefaultAsync(p => p.Id == id);
        
        if (project == null)
            return Result.Failure<ProjectDto>(_localizer["Project_NotFound"]);

        // Ortak alanları güncelle
        project.GitHubUrl = dto.GitHubUrl;
        project.LiveUrl = dto.LiveUrl;
        project.ImageUrl = dto.ImageUrl;
        project.IsPublished = dto.IsPublished;
        project.DisplayOrder = dto.DisplayOrder;
        project.UpdatedAt = DateTime.UtcNow;

        // Mevcut translation'ları güncelle veya yeni ekle
        foreach (var translationDto in dto.Translations)
        {
            var existingTranslation = project.Translations
                .FirstOrDefault(t => t.LanguageCode == translationDto.LanguageCode);

            if (existingTranslation != null)
            {
                // Mevcut translation'ı güncelle
                existingTranslation.Title = translationDto.Title;
                existingTranslation.Description = translationDto.Description;
                existingTranslation.Technologies = translationDto.Technologies;
                existingTranslation.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                // Yeni translation ekle
                var newTranslation = new ProjectTranslation
                {
                    ProjectId = project.Id,
                    LanguageCode = translationDto.LanguageCode,
                    Title = translationDto.Title,
                    Description = translationDto.Description,
                    Technologies = translationDto.Technologies
                };
                _context.ProjectTranslations.Add(newTranslation);
            }
        }

        await _context.SaveChangesAsync();

        // Translation'ları include ederek tekrar yükle
        var updatedProject = await _context.Projects
            .Include(p => p.Translations)
            .FirstOrDefaultAsync(p => p.Id == project.Id);

        var resultDto = _mapper.Map<ProjectDto>(updatedProject);
        return Result.Success(resultDto);
    }

    public async Task<Result> DeleteProjectAsync(Guid id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null)
            return Result.Failure(_localizer["Project_NotFound"]);

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();

        return Result.Success();
    }
}
