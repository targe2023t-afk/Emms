namespace EMMS.Domain.Common.Entities;

public abstract class AuditableEntity : BaseEntity
{
    public void InitializeCreated(string createdBy)
    {
        CreatedAt = DateTime.UtcNow;
        CreatedBy = createdBy;
    }
}
