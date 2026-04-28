@echo off
echo ========================================
echo INICIANDO TYSON STYLES
echo ========================================
echo.

REM Start Backend in a new window
echo [1] Iniciando Backend (Puerto 3001)...
start "TYSON-BACKEND" cmd /k "cd /d D:\Iris\Proyectos\tyson-styles\backend && npm run start:prod"

echo Esperando 5 segundos...
timeout /t 5 /nobreak >nul

REM Start Frontend in a new window
echo [2] Iniciando Frontend (Puerto 3000)...
start "TYSON-FRONTEND" cmd /k "cd /d D:\Iris\Proyectos\tyson-styles && npm run dev"

echo.
echo ========================================
echo SERVIDORES INICIADOS
echo ========================================
echo.
echo Tienda:      http://localhost:3000
echo Admin:      http://localhost:3000/admin-tyson
echo API:        http://localhost:3001/api
echo.
echo CONTRASEÑA:   Admin2024
echo.
echo Presiona cualquier tecla para salir...
pause >nul