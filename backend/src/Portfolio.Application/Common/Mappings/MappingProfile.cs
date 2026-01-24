using AutoMapper;
using Portfolio.Application.DTOs;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.Common.Mappings;

/// <summary>
/// AutoMapper profile - Entity'lerden DTO'lara mapping
/// </summary>
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Project mappings
        CreateMap<Project, ProjectDto>();
        CreateMap<CreateProjectDto, Project>();
        CreateMap<UpdateProjectDto, Project>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());

        // ProjectTranslation mappings
        CreateMap<ProjectTranslation, ProjectTranslationDto>();
        CreateMap<CreateProjectTranslationDto, ProjectTranslation>();
        CreateMap<UpdateProjectTranslationDto, ProjectTranslation>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.ProjectId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());

        // BlogPost mappings
        CreateMap<BlogPost, BlogPostDto>();
        CreateMap<CreateBlogPostDto, BlogPost>();
        CreateMap<UpdateBlogPostDto, BlogPost>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());

        // BlogPostTranslation mappings
        CreateMap<BlogPostTranslation, BlogPostTranslationDto>();
        CreateMap<CreateBlogPostTranslationDto, BlogPostTranslation>();
        CreateMap<UpdateBlogPostTranslationDto, BlogPostTranslation>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.BlogPostId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());

        // WorkExperience mappings
        CreateMap<WorkExperience, WorkExperienceDto>();
        CreateMap<CreateWorkExperienceDto, WorkExperience>();
        CreateMap<UpdateWorkExperienceDto, WorkExperience>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());

        // Education mappings
        CreateMap<Education, EducationDto>();
        CreateMap<CreateEducationDto, Education>();
        CreateMap<UpdateEducationDto, Education>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());

        // Skill mappings
        CreateMap<Skill, SkillDto>();
        CreateMap<CreateSkillDto, Skill>();
        CreateMap<UpdateSkillDto, Skill>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());

        // ContactMessage mappings
        CreateMap<ContactMessage, ContactMessageDto>();
        CreateMap<CreateContactMessageDto, ContactMessage>();
    }
}
