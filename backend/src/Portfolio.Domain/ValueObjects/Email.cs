namespace Portfolio.Domain.ValueObjects;

/// <summary>
/// Email value object - Immutable
/// </summary>
public sealed class Email
{
    public string Value { get; }

    private Email(string value)
    {
        Value = value;
    }

    public static Email Create(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email boş olamaz.", nameof(email));

        if (!IsValidEmail(email))
            throw new ArgumentException("Geçersiz email formatı.", nameof(email));

        return new Email(email.ToLowerInvariant());
    }

    private static bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }

    public override bool Equals(object? obj)
    {
        return obj is Email email && Value == email.Value;
    }

    public override int GetHashCode()
    {
        return Value.GetHashCode();
    }

    public override string ToString() => Value;
}
