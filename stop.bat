@echo off
echo ========================================
echo  Sunucular Kapatiliyor...
echo ========================================
echo.

REM Port 3002'deki server'i kapat
echo [1/2] Server (Port 3002) kapatiliyor...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do (
    taskkill /F /PID %%a 2>nul
)

REM Port 5173'teki client'i kapat
echo [2/2] Client (Port 5173) kapatiliyor...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
    taskkill /F /PID %%a 2>nul
)

echo.
echo ========================================
echo  TAMAMLANDI!
echo  Tum sunucular kapatildi.
echo ========================================
echo.
pause
