@echo off
REM Portfolio stack'ini Podman container'larinda ayaga kaldirir.
REM Kullanim: Proje kok dizininden scripts\podman-up.cmd
REM Gereksinim: Podman 4.1+ (podman compose destegi)

cd /d "%~dp0.."
if not exist docker-compose.yml (
    echo Hata: docker-compose.yml bulunamadi. Proje kokunden calistirin.
    exit /b 1
)

podman compose -f docker-compose.yml up -d --build
if errorlevel 1 (
    echo Hata: podman compose up basarisiz.
    exit /b 1
)

echo.
echo Portfolio stack ayakta.
echo   Frontend:  http://localhost:4200
echo   Backend:   http://localhost:5000
echo   Swagger:   http://localhost:5000/swagger
echo   Postgres:  localhost:5432 (portfoliodb, postgres/postgres)
echo.
echo Durdurmak icin: scripts\podman-down.cmd
