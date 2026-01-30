@echo off
chcp 65001 >nul 2>nul
title LOL Tier List - Baslat
color 0A

echo ========================================
echo  League of Legends Tier List Baslatiyor
echo ========================================
echo.

REM node_modules kontrolu
if not exist "%~dp0server\node_modules" (
    color 0C
    echo  HATA: Server bagimliliklari yuklenmemis!
    echo.
    echo  Lutfen once "ilk-kurulum.bat" dosyasini calistirin.
    echo ========================================
    pause
    exit /b 1
)

if not exist "%~dp0client\node_modules" (
    color 0C
    echo  HATA: Client bagimliliklari yuklenmemis!
    echo.
    echo  Lutfen once "ilk-kurulum.bat" dosyasini calistirin.
    echo ========================================
    pause
    exit /b 1
)

REM Server'i yeni bir pencerede baslat
echo  [1/3] Server baslatiliyor...
start "LOL Server" cmd /k "cd /d "%~dp0server" && npm run dev"

REM 3 saniye bekle (server baslasin diye)
echo  Bekleniyor...
timeout /t 3 /nobreak >nul

REM Client'i yeni bir pencerede baslat
echo  [2/3] Client baslatiliyor...
start "LOL Client" cmd /k "cd /d "%~dp0client" && npm run dev"

REM 5 saniye bekle (client baslasin diye)
echo  [3/3] Tarayici aciliyor...
timeout /t 5 /nobreak >nul

REM Tarayiciyi ac
start http://localhost:5173

echo.
color 0A
echo ========================================
echo  BASARILI!
echo ========================================
echo.
echo  Tarayiciniz acildi: http://localhost:5173
echo.
echo  Server ve Client pencereleri acildi.
echo  Kapatmak icin "stop.bat" dosyasini kullanin
echo  veya acilan cmd pencerelerini kapatin.
echo ========================================
echo.
pause
