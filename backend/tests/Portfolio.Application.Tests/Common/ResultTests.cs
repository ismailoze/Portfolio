using FluentAssertions;
using Portfolio.Domain.Common;
using Xunit;

namespace Portfolio.Application.Tests.Common;

/// <summary>
/// Domain Result ve Result{T} için unit testler
/// </summary>
public class ResultTests
{
    [Fact]
    public void Success_ShouldHaveIsSuccessTrue()
    {
        var result = Result.Success();

        result.IsSuccess.Should().BeTrue();
        result.IsFailure.Should().BeFalse();
        result.Error.Should().BeEmpty();
    }

    [Fact]
    public void Failure_ShouldHaveIsFailureTrueAndErrorSet()
    {
        var error = "Test error message";
        var result = Result.Failure(error);

        result.IsSuccess.Should().BeFalse();
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be(error);
    }

    [Fact]
    public void SuccessT_ShouldHaveValue()
    {
        var value = 42;
        var result = Result.Success(value);

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().Be(value);
    }

    [Fact]
    public void FailureT_ShouldNotExposeValue()
    {
        var result = Result.Failure<int>("Error");

        result.IsSuccess.Should().BeFalse();
        result.IsFailure.Should().BeTrue();
        result.Error.Should().Be("Error");
        var act = () => _ = result.Value;
        act.Should().Throw<InvalidOperationException>();
    }
}
