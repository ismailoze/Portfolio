namespace Portfolio.Domain.Common;

/// <summary>
/// Result pattern implementation - Exception-free business logic için
/// </summary>
public class Result
{
    public bool IsSuccess { get; private set; }
    public bool IsFailure => !IsSuccess;
    public string Error { get; private set; } = string.Empty;

    protected Result(bool isSuccess, string error)
    {
        if (isSuccess && !string.IsNullOrEmpty(error))
            throw new InvalidOperationException("Başarılı bir sonuç hata mesajı içeremez.");

        if (!isSuccess && string.IsNullOrEmpty(error))
            throw new InvalidOperationException("Başarısız bir sonuç hata mesajı içermelidir.");

        IsSuccess = isSuccess;
        Error = error;
    }

    public static Result Success() => new(true, string.Empty);
    public static Result Failure(string error) => new(false, error);

    public static Result<T> Success<T>(T value) => new(value, true, string.Empty);
    public static Result<T> Failure<T>(string error) => new(default!, false, error);
}

/// <summary>
/// Generic Result pattern implementation
/// </summary>
public class Result<T> : Result
{
    private readonly T _value;

    public T Value => IsSuccess
        ? _value
        : throw new InvalidOperationException("Başarısız bir sonuç için değer erişilemez.");

    protected internal Result(T value, bool isSuccess, string error)
        : base(isSuccess, error)
    {
        _value = value;
    }
}
