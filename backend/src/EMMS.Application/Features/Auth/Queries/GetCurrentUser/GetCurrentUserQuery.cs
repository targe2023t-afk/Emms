using MediatR;
using EMMS.Application.Common.Models;

namespace EMMS.Application.Features.Auth.Queries.GetCurrentUser;

public record GetCurrentUserQuery : IRequest<Result<UserDto>>;
