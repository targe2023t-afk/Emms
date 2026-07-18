using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace EMMS.API.Filters;

public class ApiResultFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context) { }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        if (context.Result is ObjectResult objectResult && objectResult.Value != null)
        {
            var wrapped = new
            {
                success = true,
                data = objectResult.Value,
                message = (string?)null,
                traceId = context.HttpContext.TraceIdentifier
            };
            objectResult.Value = wrapped;
        }
    }
}
