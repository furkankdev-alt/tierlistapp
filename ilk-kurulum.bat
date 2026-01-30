@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul 2>nul
title LOL Tier List - Ilk Kurulum
color 0A

echo ========================================
echo  League of Legends Tier List
echo  ILK KURULUM SCRIPTI
echo ========================================
echo.

REM Node.js kurulu mu kontrol et
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo  HATA: Node.js bulunamadi!
    echo.
    echo  Node.js kurulu degil veya PATH'e eklenmemis.
    echo  Lutfen Node.js'i indirip kurun:
    echo.
    echo  https://nodejs.org/
    echo.
    echo  LTS versiyonunu indirmeniz onerilir
    echo ========================================
    pause
    exit /b 1
)

REM npm kurulu mu kontrol et
where npm >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo  HATA: npm bulunamadi!
    echo.
    echo  Node.js kurulu ama npm bulunamadi.
    echo  Node.js'i yeniden kurun: https://nodejs.org/
    echo ========================================
    pause
    exit /b 1
)

REM Versiyon bilgilerini goster
echo  Sistem Bilgileri:
echo  ----------------------------------------
for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
for /f "tokens=*" %%i in ('npm -v') do set NPM_VER=%%i
echo  Node.js versiyonu: %NODE_VER%
echo  npm versiyonu:     v%NPM_VER%
echo  ----------------------------------------
echo.

echo  Bu script sadece ILK KULLANIMDA calistirilir.
echo  Bagimliliklari yukleyecek (2-3 dakika surebilir)
echo.

REM node_modules klasorleri var mi kontrol et
set SKIP_INSTALL=0
if exist "%~dp0server\node_modules" (
    if exist "%~dp0client\node_modules" (
        echo  node_modules klasorleri zaten mevcut!
        echo.
        echo  [1] Temiz kurulum - node_modules silinip yeniden kurulur
        echo  [2] Normal kurulum - mevcut dosyalar korunur
        echo  [3] Iptal
        echo.
        set /p SECIM="Seciminiz (1/2/3): "

        if "!SECIM!"=="3" (
            echo.
            echo  Kurulum iptal edildi.
            pause
            exit /b 0
        )

        if "!SECIM!"=="1" (
            echo.
            echo ========================================
            echo  Eski node_modules klasorleri siliniyor...
            echo ========================================
            if exist "%~dp0server\node_modules" (
                echo  Server node_modules siliniyor...
                rmdir /s /q "%~dp0server\node_modules"
            )
            if exist "%~dp0client\node_modules" (
                echo  Client node_modules siliniyor...
                rmdir /s /q "%~dp0client\node_modules"
            )
            if exist "%~dp0server\package-lock.json" del /q "%~dp0server\package-lock.json"
            if exist "%~dp0client\package-lock.json" del /q "%~dp0client\package-lock.json"
            echo  Temizlik tamamlandi!
            echo.
        )
    )
)

echo.
echo ========================================
echo  [1/2] Server Bagimliliklari Yukleniyor...
echo ========================================
echo.
cd /d "%~dp0server"
call npm install
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ========================================
    echo  HATA: Server bagimliliklari yuklenemedi!
    echo ========================================
    echo.
    echo  Olasi cozumler:
    echo  1. Internet baglantinizi kontrol edin
    echo  2. npm cache temizleyin: npm cache clean --force
    echo  3. Node.js'i yeniden kurun
    echo.
    pause
    exit /b 1
)
echo.
echo  Server bagimliliklari basariyla yuklendi!

echo.
echo ========================================
echo  [2/2] Client Bagimliliklari Yukleniyor...
echo ========================================
echo.
cd /d "%~dp0client"
call npm install
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ========================================
    echo  HATA: Client bagimliliklari yuklenemedi!
    echo ========================================
    echo.
    echo  Olasi cozumler:
    echo  1. Internet baglantinizi kontrol edin
    echo  2. npm cache temizleyin: npm cache clean --force
    echo  3. Node.js'i yeniden kurun
    echo.
    pause
    exit /b 1
)
echo.
echo  Client bagimliliklari basariyla yuklendi!

echo.
color 0A
echo ========================================
echo  KURULUM BASARIYLA TAMAMLANDI!
echo ========================================
echo.
echo  Yuklenen paketler:
echo  ----------------------------------------
echo  Server: express, cors, multer, express-rate-limit
echo  Client: svelte, sveltekit, vite, svelte-dnd-action
echo  ----------------------------------------
echo.
echo  Siradaki adim:
echo  "start.bat" dosyasina cift tiklayarak
echo  uygulamayi baslatabilirsiniz.
echo.
echo  Keyifli kullanimlar!
echo ========================================
pause
endlocal
