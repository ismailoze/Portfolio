namespace Portfolio.Domain.ValueObjects;

/// <summary>
/// URL value object - Immutable
/// </summary>
public sealed class Url
{
    public string Value { get; }

    private Url(string value)
    {
        Value = value;
    }

    public static Url Create(string url)
    {
        if (string.IsNullOrWhiteSpace(url))
            throw new ArgumentException("URL boş olamaz.", nameof(url));

        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
            throw new ArgumentException("Geçersiz URL formatı.", nameof(url));

        return new Url(url);
    }

    public override bool Equals(object? obj)
    {
        return obj is Url url && Value == url.Value;
    }

    public override int GetHashCode()
    {
        return Value.GetHashCode();
    }

    public override string ToString() => Value;
}
