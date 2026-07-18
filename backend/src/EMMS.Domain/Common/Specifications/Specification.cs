using System.Linq.Expressions;

namespace EMMS.Domain.Common.Specifications;

public abstract class Specification<T>
{
    public abstract Expression<Func<T, bool>> ToExpression();

    public bool IsSatisfiedBy(T entity)
    {
        var predicate = ToExpression().Compile();
        return predicate(entity);
    }

    public static implicit operator Expression<Func<T, bool>>(Specification<T> spec) => spec.ToExpression();
}
