# Test creating a requirement with real reference data

# First get the department, job level, and location IDs
Write-Host "Fetching reference data IDs..." -ForegroundColor Cyan

$env:PGPASSWORD='HiringHare2024'
$deptId = (psql -U hiring_hare_user -d hiring_hare -h localhost -t -c "SELECT id FROM departments WHERE name='Engineering' LIMIT 1;")[0].Trim()
$levelId = (psql -U hiring_hare_user -d hiring_hare -h localhost -t -c "SELECT id FROM job_levels WHERE name='Senior' LIMIT 1;")[0].Trim()
$locationId = (psql -U hiring_hare_user -d hiring_hare -h localhost -t -c "SELECT id FROM locations WHERE city='San Francisco' LIMIT 1;")[0].Trim()

Write-Host "Department ID: $deptId" -ForegroundColor Yellow
Write-Host "Job Level ID: $levelId" -ForegroundColor Yellow
Write-Host "Location ID: $locationId" -ForegroundColor Yellow

# Login
Write-Host ""
Write-Host "Logging in..." -ForegroundColor Cyan
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/auth/login" -Method POST -ContentType "application/x-www-form-urlencoded" -Body "username=admin@hiringhare.com&password=Admin@2024"

$token = $loginResponse.access_token
Write-Host "Login successful!" -ForegroundColor Green

# Create requirement
Write-Host ""
Write-Host "Creating requirement..." -ForegroundColor Cyan
$newReq = @{
    position_title = "Senior Software Engineer"
    department_id = $deptId
    job_level_id = $levelId
    location_id = $locationId
    requirement_type = "new_headcount"
    employment_type = "full_time"
    work_mode = "hybrid"
    number_of_positions = 2
    priority = "high"
    job_description = "We are looking for an experienced software engineer to join our team and work on cutting-edge Python and React applications."
    required_qualifications = "Bachelor's degree in Computer Science or related field, 5+ years of professional software development experience, strong expertise in Python and modern web frameworks."
    justification = "Team expansion to support new product launch in Q2 2026."
    required_skills = @{
        "Python" = $true
        "FastAPI" = $true
        "React" = $true
        "PostgreSQL" = $true
        "Docker" = $true
    }
    min_salary = 120000
    max_salary = 180000
    currency = "USD"
} | ConvertTo-Json

try {
    $created = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/requirements" -Method POST -Headers @{"Authorization" = "Bearer $token"; "Content-Type" = "application/json"} -Body $newReq
    
    Write-Host ""
    Write-Host "=== Requirement Created Successfully! ===" -ForegroundColor Green
    Write-Host "Requirement Number: $($created.requirement_number)" -ForegroundColor Cyan
    Write-Host "Position: $($created.position_title)" -ForegroundColor Cyan
    Write-Host "Status: $($created.status)" -ForegroundColor Cyan
    Write-Host "Priority: $($created.priority)" -ForegroundColor Cyan
    Write-Host "ID: $($created.id)" -ForegroundColor Yellow
} catch {
    Write-Host "Error creating requirement: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Test complete!" -ForegroundColor Green
