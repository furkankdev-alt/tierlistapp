@echo off
echo ========================================
echo  League of Legends Tier List Baslatiyor
echo ========================================
echo.

REM Server'i yeni bir pencerede baslat
echo [1/3] Server baslatiliyor...
start "LOL Server" cmd /k "cd /d %~dp0server && npm run dev"

REM 3 saniye bekle (server baslasin diye)
timeout /t 3 /nobreak >nul

REM Client'i yeni bir pencerede baslat
echo [2/3] Client baslatiliyor...
start "LOL Client" cmd /k "cd /d %~dp0client && npm run dev"

REM 5 saniye bekle (client baslasin diye)
echo [3/3] Tarayici aciliyor...
timeout /t 5 /nobreak >nul

REM Tarayiciyi ac
start http://localhost:5173

echo.
echo ========================================
echo  BASARILI!
echo  Tarayiciniz acildi: http://localhost:5173
echo ========================================
echo.
echo Server ve Client pencereleri acildi.
echo Kapatmak icin bu pencereyi kapatabilirsiniz.
echo (Server ve Client pencereleri acik kalacak)
echo.
pause
