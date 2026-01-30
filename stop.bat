@echo off
chcp 65001 >nul 2>nul
title LOL Tier List - Durdur
color 0E

echo ========================================
echo  Sunucular Kapatiliyor...
echo ========================================
echo.

REM Port 3002'deki server'i kapat
echo  [1/2] Server (Port 3002) kapatiliyor...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>nul
)

REM Port 5173'teki client'i kapat
echo  [2/2] Client (Port 5173) kapatiliyor...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>nul
)

echo.
color 0A
echo ========================================
echo  TAMAMLANDI!
echo  Tum sunucular kapatildi.
echo ========================================
echo.
pause
