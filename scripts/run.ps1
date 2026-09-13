# scripts/run.ps1
Write-Host "=== Starting EditLab (Backend + Frontend) ===" -ForegroundColor Cyan

$backendPath = Join-Path $PSScriptRoot "..\backend"
$frontendPath = Join-Path $PSScriptRoot "..\frontend"
$venvPython = Join-Path $backendPath ".venv\Scripts\python.exe"

# Start Backend in background process or separate window
Write-Host "Starting FastAPI Backend on http://localhost:8000..." -ForegroundColor Green
$backendProc = Start-Process -FilePath $venvPython -ArgumentList "-m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload" -WorkingDirectory (Join-Path $PSScriptRoot "..") -PassThru

Write-Host "Starting Next.js Frontend on http://localhost:3000..." -ForegroundColor Green
Set-Location $frontendPath
npm run dev
