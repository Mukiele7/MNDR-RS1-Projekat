using MNDR.API.Middleware;
using MNDR.Application;
using MNDR.Infrastructure;
using System.Globalization;
using Microsoft.AspNetCore.Localization;

var builder = WebApplication.CreateBuilder(args);

// ============================================
// DEPENDENCY INJECTION - Clean Architecture
// ============================================

// API layer servisi
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // JSON serialization za decimale, datume
        options.JsonSerializerOptions.WriteIndented = true;
    });

builder.Services.AddSwaggerGen();

// ============================================
// REGIONALNE POSTAVKE - sr-Latn-BA
// ============================================
var supportedCultures = new[]
{
    new CultureInfo("sr-Latn-BA"), // Srpski (Bosna i Hercegovina, latinica)
    new CultureInfo("bs-Latn-BA"), // Bosanski (latinica)
    new CultureInfo("hr-BA"),      // Hrvatski (Bosna i Hercegovina)
    new CultureInfo("en-US")       // Engleski (fallback)
};

builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    options.DefaultRequestCulture = new RequestCulture("sr-Latn-BA");
    options.SupportedCultures = supportedCultures;
    options.SupportedUICultures = supportedCultures;
    options.ApplyCurrentCultureToResponseHeaders = true;
});

// Postavi globalnu kulturu
CultureInfo.DefaultThreadCurrentCulture = new CultureInfo("sr-Latn-BA");
CultureInfo.DefaultThreadCurrentUICulture = new CultureInfo("sr-Latn-BA");

// Global Exception Handler
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// Infrastructure layer - Database, JWT, servisi
builder.Services.AddInfrastructure(builder.Configuration);

// Application layer - MediatR, FluentValidation, Behaviors
builder.Services.AddApplication();

// CORS za Angular frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", corsBuilder =>
    {
        corsBuilder.WithOrigins(
                "http://localhost:4200",
                "http://localhost:4201",
                "http://localhost:4202",
                "http://localhost:4203")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// ============================================
// MIDDLEWARE PIPELINE
// ============================================

var app = builder.Build();

// Test database connection and log info
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<MNDR.Infrastructure.Data.MndrDbContext>();
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    Console.WriteLine($"=== BACKEND KORISTI BAZU: {connectionString} ===");
    
    try
    {
        var canConnect = dbContext.Database.CanConnect();
        Console.WriteLine($"=== Database connection: {(canConnect ? "SUCCESS" : "FAILED")} ===");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"=== Database error: {ex.Message} ===");
    }
}

// Global Exception Handler - mora biti PRVO!
app.UseExceptionHandler();

// Static files za slike profila
app.UseStaticFiles();

// Swagger - samo u Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAngular");
app.UseHttpsRedirection();

// Regionalne postavke
app.UseRequestLocalization();

// VAŽNO: Authentication mora biti PRE Authorization!
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
