using EMMS.Domain.Common.Entities;
using Xunit;

namespace EMMS.Domain.Tests.Entities;

public class BaseEntityTests
{
    [Fact]
    public void BaseEntity_ShouldGenerateGuidOnCreation()
    {
        // Arrange & Act
        var entity = new TestEntity();

        // Assert
        Assert.NotEqual(Guid.Empty, entity.Id);
    }

    [Fact]
    public void MarkAsDeleted_ShouldSetIsDeletedAndDeletedAt()
    {
        // Arrange
        var entity = new TestEntity();

        // Act
        entity.MarkAsDeleted("test-user");

        // Assert
        Assert.True(entity.IsDeleted);
        Assert.NotNull(entity.DeletedAt);
        Assert.Equal("test-user", entity.DeletedBy);
    }

    private class TestEntity : BaseEntity { }
}
