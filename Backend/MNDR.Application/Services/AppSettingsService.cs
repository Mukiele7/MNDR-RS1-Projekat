using Microsoft.Extensions.Configuration;

namespace MNDR.Application.Services
{
    public interface IAppSettingsService
    {
        int GetDefaultPageSize();
        int GetMaxPageSize();
        bool AreEmailNotificationsEnabled();
        string GetAdminEmail();
        string GetSupportEmail();
        int GetMaxUploadSizeMB();
        string[] GetAllowedFileExtensions();
    }

    public class AppSettingsService : IAppSettingsService
    {
        private readonly IConfiguration _configuration;

        public AppSettingsService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public int GetDefaultPageSize()
        {
            return int.TryParse(_configuration["AppSettings:DefaultPageSize"], out var value) ? value : 10;
        }

        public int GetMaxPageSize()
        {
            return int.TryParse(_configuration["AppSettings:MaxPageSize"], out var value) ? value : 100;
        }

        public bool AreEmailNotificationsEnabled()
        {
            return bool.TryParse(_configuration["AppSettings:EnableEmailNotifications"], out var value) && value;
        }

        public string GetAdminEmail()
        {
            return _configuration["AppSettings:AdminEmail"] ?? "admin@mndr.com";
        }

        public string GetSupportEmail()
        {
            return _configuration["AppSettings:SupportEmail"] ?? "support@mndr.com";
        }

        public int GetMaxUploadSizeMB()
        {
            return int.TryParse(_configuration["AppSettings:MaxUploadSizeMB"], out var value) ? value : 5;
        }

        public string[] GetAllowedFileExtensions()
        {
            var extensions = _configuration.GetSection("AppSettings:AllowedFileExtensions")
                .GetChildren()
                .Select(x => x.Value ?? string.Empty)
                .Where(x => !string.IsNullOrEmpty(x))
                .ToArray();
            
            return extensions.Length > 0 ? extensions : new[] { ".jpg", ".jpeg", ".png", ".pdf" };
        }
    }
}
