namespace Portfolio.Domain.ValueObjects;

/// <summary>
/// Tarih aralığı value object - Immutable
/// </summary>
public sealed class DateRange
{
    public DateTime StartDate { get; }
    public DateTime? EndDate { get; }

    private DateRange(DateTime startDate, DateTime? endDate)
    {
        if (endDate.HasValue && endDate.Value < startDate)
            throw new ArgumentException("Bitiş tarihi başlangıç tarihinden önce olamaz.");

        StartDate = startDate;
        EndDate = endDate;
    }

    public static DateRange Create(DateTime startDate, DateTime? endDate = null)
    {
        return new DateRange(startDate, endDate);
    }

    public bool IsActive(DateTime? referenceDate = null)
    {
        var date = referenceDate ?? DateTime.UtcNow;
        return date >= StartDate && (!EndDate.HasValue || date <= EndDate.Value);
    }

    public override bool Equals(object? obj)
    {
        return obj is DateRange range &&
               StartDate == range.StartDate &&
               EndDate == range.EndDate;
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(StartDate, EndDate);
    }
}
