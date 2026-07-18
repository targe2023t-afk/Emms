using MediatR;
using EMMS.Application.Common.Models;

namespace EMMS.Application.Features.Auth.Commands.Login;

public record LoginCommand(string Email, string Password, bool RememberMe) : IRequest<Result<LoginResponse>>;

public record LoginResponse(
    string Token,
    string RefreshToken,
    UserDto User,
    int ExpiresIn);

public record UserDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string FullName,
    string? AvatarUrl,
    string Role,
    bool IsActive);
