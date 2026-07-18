namespace EMMS.Domain.Common.Interfaces;

public interface IAuditable
{
    DateTime CreatedAt { get; }
    DateTime? UpdatedAt { get; }
    string CreatedBy { get; }
    string? UpdatedBy { get; }
}
