namespace EMMS.Domain.Common.Exceptions;

public class NotFoundException : DomainException
{
    public NotFoundException(string entityName, object key)
        : base($"Entity "{entityName}" ({key}) was not found.") { }
}
