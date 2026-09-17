@echo off
chcp 65001 >nul
title UniEmpleo — Inicio Automático
cls

echo ======================================================
echo           INICIANDO PLATAFORMA UNIEMPLEO
echo ======================================================
echo.
echo [1/3] Verificando entorno de Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está instalado o no se encuentra en el PATH.
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

echo [2/3] Iniciando Servidor Backend (Puerto 5000)...
start "UniEmpleo - Backend API" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 2 /nobreak >nul

echo [3/3] Iniciando Servidor Frontend (Puerto 5173)...
start "UniEmpleo - Frontend Web" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ======================================================
echo    Plataforma iniciada con éxito!
echo ======================================================
echo.
echo Abriendo navegador en http://localhost:5173 ...
start http://localhost:5173

echo.
echo Credenciales de acceso de prueba:
echo   - Estudiante: estudiante@demo.com  / demo1234
echo   - Empresa:    empresa@demo.com     / demo1234
echo   - Admin:      admin@uniempleo.com  / admin1234
echo.
echo Puedes minimizar esta ventana. Para apagar la plataforma,
echo simplemente cierra las ventanas de Backend y Frontend.
echo ======================================================
pause
