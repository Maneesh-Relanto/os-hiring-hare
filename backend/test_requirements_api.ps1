# Test Requirements API with authentication

# First, login to get a valid token
$loginBody = @{
    username = "admin@hiringhare.com"
    password = "Admin@2024"
} | ConvertTo-Json

Write-Host "Logging in..." -ForegroundColor Cyan
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/auth/login" `
    -Method POST `
    -ContentType "application/x-www-form-urlencoded" `
    -Body "username=admin@hiringhare.com&password=Admin@2024"

$token = $loginResponse.access_token
Write-Host "Login successful! Token: $($token.Substring(0, 20))..." -ForegroundColor Green

# Test listing requirements
Write-Host "`nTesting GET /api/v1/requirements..." -ForegroundColor Cyan
$headers = @{
    "Authorization" = "Bearer $token"
}

$requirements = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/requirements?skip=0&limit=10" `
    -Method GET `
    -Headers $headers

Write-Host "Found $($requirements.total) requirements" -ForegroundColor Green
if ($requirements.items.Count -gt 0) {
    Write-Host "`nFirst requirement:" -ForegroundColor Yellow
    $requirements.items[0] | ConvertTo-Json -Depth 2
} else {
    Write-Host "No requirements found. Let's create one!" -ForegroundColor Yellow
    
    # Create a test requirement
    Write-Host "`nCreating test requirement..." -ForegroundColor Cyan
    $newReq = @{
        position_title = "Senior Software Engineer"
        department_id = "00000000-0000-0000-0000-000000000001"
        job_level_id = "00000000-0000-0000-0000-000000000001"
        location_id = "00000000-0000-0000-0000-000000000001"
        requirement_type = "NEW_POSITION"
        employment_type = "FULL_TIME"
        work_mode = "HYBRID"
        number_of_positions = 2
        priority = "HIGH"
        job_description = "We are looking for an experienced software engineer to join our team."
        required_qualifications = "Bachelor's degree in Computer Science, 5+ years of experience"
        justification = "Team expansion to support new product launch"
        required_skills = @{
            "Python" = $true
            "React" = $true
            "PostgreSQL" = $true
        }
    } | ConvertTo-Json

    try {
        $created = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/requirements" `
            -Method POST `
            -Headers @{
                "Authorization" = "Bearer $token"
                "Content-Type" = "application/json"
            } `
            -Body $newReq
        
        Write-Host "✓ Requirement created successfully!" -ForegroundColor Green
        Write-Host "Requirement Number: $($created.requirement_number)" -ForegroundColor Cyan
        Write-Host "Status: $($created.status)" -ForegroundColor Cyan
    } catch {
        Write-Host "Error creating requirement: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "[OK] API test complete!" -ForegroundColor Green
