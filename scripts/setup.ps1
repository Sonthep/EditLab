# scripts/setup.ps1
Write-Host "=== EditLab Environment Setup ===" -ForegroundColor Cyan

# 1. Check FFmpeg
& "$PSScriptRoot\check_ffmpeg.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Warning: FFmpeg is not available. Please install it for video analysis." -ForegroundColor Yellow
}

# 2. Python Virtual Environment
$venvPath = Join-Path $PSScriptRoot "..\backend\.venv"
if (-not (Test-Path $venvPath)) {
    Write-Host "Creating Python virtual environment in backend/.venv..." -ForegroundColor Cyan
    python -m venv $venvPath
}

Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
& "$venvPath\Scripts\pip" install -r "$PSScriptRoot\..\backend\requirements.txt"

# 3. Initialize Database
Write-Host "Initializing SQLite Database..." -ForegroundColor Cyan
& "$venvPath\Scripts\python" "$PSScriptRoot\..\backend\database\db.py"

Write-Host "`nSetup completed successfully!" -ForegroundColor Green
