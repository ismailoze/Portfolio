using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Portfolio.Api.Controllers;
using Portfolio.Application.DTOs;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Common;
using Xunit;

namespace Portfolio.Api.Tests.Controllers;

/// <summary>
/// ProjectsController için unit testler
/// </summary>
public class ProjectsControllerTests
{
    private readonly Mock<IProjectService> _projectServiceMock;
    private readonly ProjectsController _controller;

    public ProjectsControllerTests()
    {
        _projectServiceMock = new Mock<IProjectService>();
        _controller = new ProjectsController(_projectServiceMock.Object);
    }

    [Fact]
    public async Task GetPublishedProjects_Success_ShouldReturnOk()
    {
        var projects = new List<ProjectDto>();
        _projectServiceMock
            .Setup(x => x.GetPublishedProjectsAsync())
            .ReturnsAsync(Result.Success<IEnumerable<ProjectDto>>(projects));

        var result = await _controller.GetPublishedProjects();

        result.Should().BeOfType<OkObjectResult>();
        (result as OkObjectResult)!.Value.Should().BeSameAs(projects);
    }

    [Fact]
    public async Task GetPublishedProjects_Failure_ShouldReturnBadRequest()
    {
        _projectServiceMock
            .Setup(x => x.GetPublishedProjectsAsync())
            .ReturnsAsync(Result.Failure<IEnumerable<ProjectDto>>("Service error"));

        var result = await _controller.GetPublishedProjects();

        result.Should().BeOfType<BadRequestObjectResult>();
        var badRequest = result as BadRequestObjectResult;
        badRequest!.Value.Should().NotBeNull();
    }

    [Fact]
    public async Task GetProject_ExistingId_ShouldReturnOk()
    {
        var id = Guid.NewGuid();
        var project = new ProjectDto(
            id, "https://github.com/x", "https://live.com", null, true, 1,
            DateTime.UtcNow, null, Array.Empty<ProjectTranslationDto>());
        _projectServiceMock
            .Setup(x => x.GetProjectByIdAsync(id))
            .ReturnsAsync(Result.Success(project));

        var result = await _controller.GetProject(id);

        result.Should().BeOfType<OkObjectResult>();
        (result as OkObjectResult)!.Value.Should().BeEquivalentTo(project);
    }

    [Fact]
    public async Task GetProject_NotFound_ShouldReturnNotFound()
    {
        var id = Guid.NewGuid();
        _projectServiceMock
            .Setup(x => x.GetProjectByIdAsync(id))
            .ReturnsAsync(Result.Failure<ProjectDto>("Proje bulunamadı."));

        var result = await _controller.GetProject(id);

        result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task CreateProject_Success_ShouldReturnCreatedAtAction()
    {
        var dto = new CreateProjectDto(
            new[] { new CreateProjectTranslationDto("en", "Title", "Desc", null) },
            "https://github.com/x", null, null, true, 0);
        var created = new ProjectDto(
            Guid.NewGuid(), "https://github.com/x", null, null, true, 0,
            DateTime.UtcNow, null, null);
        _projectServiceMock
            .Setup(x => x.CreateProjectAsync(dto))
            .ReturnsAsync(Result.Success(created));

        var result = await _controller.CreateProject(dto);

        result.Should().BeOfType<CreatedAtActionResult>();
        var createdResult = result as CreatedAtActionResult;
        createdResult!.ActionName.Should().Be(nameof(ProjectsController.GetProject));
        createdResult.Value.Should().BeEquivalentTo(created);
    }

    [Fact]
    public async Task CreateProject_Failure_ShouldReturnBadRequest()
    {
        var dto = new CreateProjectDto(
            new[] { new CreateProjectTranslationDto("en", "Title", "Desc", null) },
            null, null, null, false, 0);
        _projectServiceMock
            .Setup(x => x.CreateProjectAsync(dto))
            .ReturnsAsync(Result.Failure<ProjectDto>("Validation failed"));

        var result = await _controller.CreateProject(dto);

        result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task UpdateProject_Success_ShouldReturnOk()
    {
        var id = Guid.NewGuid();
        var dto = new UpdateProjectDto(
            new[] { new UpdateProjectTranslationDto("en", "Title", "Desc", null) },
            null, null, null, true, 0);
        var updated = new ProjectDto(
            id, null, null, null, true, 0, DateTime.UtcNow, DateTime.UtcNow, null);
        _projectServiceMock
            .Setup(x => x.UpdateProjectAsync(id, dto))
            .ReturnsAsync(Result.Success(updated));

        var result = await _controller.UpdateProject(id, dto);

        result.Should().BeOfType<OkObjectResult>();
        (result as OkObjectResult)!.Value.Should().BeEquivalentTo(updated);
    }

    [Fact]
    public async Task UpdateProject_Failure_ShouldReturnBadRequest()
    {
        var id = Guid.NewGuid();
        var dto = new UpdateProjectDto(
            new[] { new UpdateProjectTranslationDto("en", "Title", "Desc", null) },
            null, null, null, true, 0);
        _projectServiceMock
            .Setup(x => x.UpdateProjectAsync(id, dto))
            .ReturnsAsync(Result.Failure<ProjectDto>("Update failed"));

        var result = await _controller.UpdateProject(id, dto);

        result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task DeleteProject_Success_ShouldReturnNoContent()
    {
        var id = Guid.NewGuid();
        _projectServiceMock
            .Setup(x => x.DeleteProjectAsync(id))
            .ReturnsAsync(Result.Success());

        var result = await _controller.DeleteProject(id);

        result.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    public async Task DeleteProject_Failure_ShouldReturnBadRequest()
    {
        var id = Guid.NewGuid();
        _projectServiceMock
            .Setup(x => x.DeleteProjectAsync(id))
            .ReturnsAsync(Result.Failure("Delete failed"));

        var result = await _controller.DeleteProject(id);

        result.Should().BeOfType<BadRequestObjectResult>();
    }
}
