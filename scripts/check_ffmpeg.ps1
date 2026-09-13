# scripts/check_ffmpeg.ps1
Write-Host "Checking FFmpeg and FFprobe installation..." -ForegroundColor Cyan

$ffmpeg = Get-Command ffmpeg -ErrorAction SilentlyContinue
$ffprobe = Get-Command ffprobe -ErrorAction SilentlyContinue

if ($null -eq $ffmpeg) {
    Write-Host "[-] FFmpeg NOT found in PATH. Please install FFmpeg or set its directory in Settings." -ForegroundColor Red
    exit 1
} else {
    Write-Host "[+] FFmpeg found at: $($ffmpeg.Source)" -ForegroundColor Green
    & ffmpeg -version | Select-Object -First 1
}

if ($null -eq $ffprobe) {
    Write-Host "[-] FFprobe NOT found in PATH." -ForegroundColor Red
    exit 1
} else {
    Write-Host "[+] FFprobe found at: $($ffprobe.Source)" -ForegroundColor Green
    & ffprobe -version | Select-Object -First 1
}

Write-Host "`nAll video analysis tools are operational." -ForegroundColor Cyan
exit 0
