@echo off
REM Portfolio stack'ini (Podman container'larini) durdurur ve kaldirir.
REM Kullanim: Proje kok dizininden scripts\podman-down.cmd

cd /d "%~dp0.."
if not exist docker-compose.yml (
    echo Hata: docker-compose.yml bulunamadi. Proje kokunden calistirin.
    exit /b 1
)

podman compose -f docker-compose.yml down
if errorlevel 1 (
    echo Hata: podman compose down basarisiz.
    exit /b 1
)

echo Portfolio container'lari durduruldu.
echo Tekrar baslatmak icin: scripts\podman-up.cmd
