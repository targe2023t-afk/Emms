namespace EMMS.Domain.Common.Exceptions;

public class ValidationException : DomainException
{
    public IReadOnlyDictionary<string, string[]> Errors { get; }

    public ValidationException(IDictionary<string, string[]> errors)
        : base("One or more validation failures have occurred.")
    {
        Errors = new Dictionary<string, string[]>(errors).AsReadOnly();
    }
}
