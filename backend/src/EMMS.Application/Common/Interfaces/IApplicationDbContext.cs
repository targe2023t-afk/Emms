using Microsoft.EntityFrameworkCore;
using EMMS.Domain.Common.Entities;

namespace EMMS.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<T> Set<T>() where T : BaseEntity;
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
