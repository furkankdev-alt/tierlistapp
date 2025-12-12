@echo off
title LOL Tier List - Ilk Kurulum
color 0A

echo ========================================
echo  League of Legends Tier List
echo  ILK KURULUM SCRIPTI
echo ========================================
echo.
echo Bu script sadece ILK KULLANIMDA calistirilir.
echo Bagimliliklari yukleyecek (2-3 dakika surebilir)
echo.
pause

echo.
echo ========================================
echo  [1/2] Server Bagimliliklari Yukleniyor...
echo ========================================
cd /d "%~dp0server"
call npm install
if %errorlevel% neq 0 (
    echo.
    echo HATA: Server bagimliliklari yuklenemedi!
    echo Node.js kurulu mu kontrol edin: https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo ========================================
echo  [2/2] Client Bagimliliklari Yukleniyor...
echo ========================================
cd /d "%~dp0client"
call npm install
if %errorlevel% neq 0 (
    echo.
    echo HATA: Client bagimliliklari yuklenemedi!
    pause
    exit /b 1
)

echo.
echo ========================================
echo  KURULUM TAMAMLANDI!
echo ========================================
echo.
echo Artik "start.bat" dosyasina cift tiklayarak
echo projeyi baslatabilirsiniz.
echo.
echo Keyifli kullanimlar!
echo ========================================
pause
