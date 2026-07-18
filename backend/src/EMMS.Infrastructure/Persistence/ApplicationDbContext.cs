using EMMS.Application.Common.Interfaces;
using EMMS.Domain.Common.Entities;
using EMMS.Domain.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EMMS.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    private readonly ICurrentUserService _currentUserService;

    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        ICurrentUserService currentUserService) : base(options)
    {
        _currentUserService = currentUserService;
    }

    public DbSet<T> Set<T>() where T : BaseEntity => base.Set<T>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<AuditableEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.InitializeCreated(_currentUserService.UserId ?? "system");
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdateTimestamp(_currentUserService.UserId ?? "system");
                    break;
            }
        }

        foreach (var entry in ChangeTracker.Entries<ISoftDelete>())
        {
            if (entry.State == EntityState.Deleted)
            {
                entry.State = EntityState.Modified;
                entry.Entity.MarkAsDeleted(_currentUserService.UserId ?? "system");
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
