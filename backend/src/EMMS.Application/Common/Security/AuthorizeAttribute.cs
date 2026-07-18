namespace EMMS.Application.Common.Security;

[AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
public class AuthorizeAttribute : Attribute
{
    public string[] Roles { get; }

    public AuthorizeAttribute(params string[] roles)
    {
        Roles = roles;
    }
}
