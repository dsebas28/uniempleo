# UniEmpleo — Automatización de arranque en PowerShell
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "          INICIANDO PLATAFORMA UNIEMPLEO              " -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Cyan

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
if (-not $scriptPath) { $scriptPath = Get-Location }

# 1. Start Backend in separate process
Write-Host "[1/3] Iniciando Backend en puerto 5000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptPath\backend'; npm run dev"

Start-Sleep -Seconds 2

# 2. Start Frontend in separate process
Write-Host "[2/3] Iniciando Frontend en puerto 5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptPath\frontend'; npm run dev"

Start-Sleep -Seconds 3

# 3. Open Browser
Write-Host "[3/3] Abriendo navegador en http://localhost:5173..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host "`n======================================================" -ForegroundColor Cyan
Write-Host "   ¡Plataforma iniciada y disponible en el navegador!" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "Credenciales de prueba:" -ForegroundColor White
Write-Host "  Estudiante: estudiante@demo.com  / demo1234" -ForegroundColor Gray
Write-Host "  Empresa:    empresa@demo.com     / demo1234" -ForegroundColor Gray
Write-Host "  Admin:      admin@uniempleo.com  / admin1234" -ForegroundColor Gray
Write-Host "======================================================" -ForegroundColor Cyan
