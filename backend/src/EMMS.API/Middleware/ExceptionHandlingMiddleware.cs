using System.Text.Json;
using EMMS.Domain.Common.Exceptions;

namespace EMMS.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var traceId = Guid.NewGuid().ToString();
        context.Response.ContentType = "application/json";
        context.Response.Headers.Append("X-Trace-Id", traceId);

        var (statusCode, message, errors) = exception switch
        {
            ValidationException ve => (StatusCodes.Status422UnprocessableEntity, ve.Message, ve.Errors),
            NotFoundException ne => (StatusCodes.Status404NotFound, ne.Message, null),
            UnauthorizedException ue => (StatusCodes.Status401Unauthorized, ue.Message, null),
            DomainException de => (StatusCodes.Status400BadRequest, de.Message, null),
            _ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred.", null)
        };

        context.Response.StatusCode = statusCode;

        if (statusCode == StatusCodes.Status500InternalServerError)
        {
            _logger.LogError(exception, "Unhandled exception. TraceId: {TraceId}", traceId);
        }

        var response = new
        {
            success = false,
            message,
            errors,
            traceId
        };

        return context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
