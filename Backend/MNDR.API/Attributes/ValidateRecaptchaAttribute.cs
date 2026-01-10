using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Text.Json;

namespace MNDR.API.Attributes;

[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
public class ValidateRecaptchaAttribute : ActionFilterAttribute
{
    private const string RecaptchaSecretKey = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"; // Google test secret key

    public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var request = context.HttpContext.Request;
        
        // Pročitaj body
        request.EnableBuffering();
        using var reader = new StreamReader(request.Body, leaveOpen: true);
        var body = await reader.ReadToEndAsync();
        request.Body.Position = 0;

        // Uzmi reCAPTCHA token
        string? recaptchaToken = null;
        if (!string.IsNullOrEmpty(body))
        {
            try
            {
                var jsonDoc = JsonDocument.Parse(body);
                if (jsonDoc.RootElement.TryGetProperty("recaptchaToken", out var tokenElement))
                {
                    recaptchaToken = tokenElement.GetString();
                }
            }
            catch { }
        }

        if (string.IsNullOrEmpty(recaptchaToken))
        {
            context.Result = new BadRequestObjectResult(new { success = false, message = "reCAPTCHA token nedostaje" });
            return;
        }

        // Verifikuj reCAPTCHA sa Google-om
        using var httpClient = new HttpClient();
        var response = await httpClient.PostAsync(
            $"https://www.google.com/recaptcha/api/siteverify?secret={RecaptchaSecretKey}&response={recaptchaToken}",
            null
        );

        var responseContent = await response.Content.ReadAsStringAsync();
        var verificationResult = JsonDocument.Parse(responseContent);

        if (!verificationResult.RootElement.TryGetProperty("success", out var successElement) || 
            !successElement.GetBoolean())
        {
            context.Result = new BadRequestObjectResult(new { success = false, message = "reCAPTCHA verifikacija neuspješna" });
            return;
        }

        await next();
    }
}
