$body = @{
    FirstName = "Ana"
    LastName = "Anic"
    Email = "ana@test.com"
    PhoneNumber = "061111222"
    Password = "Ana123!"
    ConfirmPassword = "Ana123!"
    Role = 0
} | ConvertTo-Json

Write-Host "Sending registration request..." -ForegroundColor Yellow
Write-Host "Body: $body" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5017/api/Auth/register" -Method POST -Body $body -ContentType "application/json"
    Write-Host "`nSUCCESS!" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "`nERROR!" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}
