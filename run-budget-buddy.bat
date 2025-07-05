@echo off
setlocal EnableDelayedExpansion

echo 🚀 Budget Buddy Docker Setup
echo ============================

:: Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker first:
    echo    https://docs.docker.com/get-docker/
    pause
    exit /b 1
)

:: Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first:
    echo    https://docs.docker.com/compose/install/
    pause
    exit /b 1
)

:: Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker and try again.
    pause
    exit /b 1
)

echo ✅ Docker is ready!

:: Check if ports are available
echo 🔍 Checking required ports...
netstat -an | findstr ":3001" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Port 3001 is already in use.
    echo    You can edit docker-compose.yml to use a different port
    set /p continue="Continue anyway? (y/N): "
    if /i not "!continue!"=="y" exit /b 1
)

netstat -an | findstr ":27017" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Port 27017 is already in use (MongoDB).
    set /p continue="Continue anyway? (y/N): "
    if /i not "!continue!"=="y" exit /b 1
)

echo ✅ Ports are available!

:: Build and start
echo 📦 Building and starting Budget Buddy...
echo    This may take a few minutes on the first run...

:: Ask user preference
echo.
echo How would you like to run Budget Buddy?
echo 1. Foreground (see logs, Ctrl+C to stop)
echo 2. Background (detached mode)
set /p choice="Choose (1 or 2): "

if "%choice%"=="2" (
    echo 🚀 Starting in background mode...
    docker-compose up --build -d
    
    echo ⏳ Waiting for services to be ready...
    timeout /t 10 /nobreak >nul
    
    echo 📊 Service status:
    docker-compose ps
    
    echo.
    echo 🎉 Budget Buddy is running!
    echo 📱 Access your app at: http://localhost:3001
    echo.
    echo Useful commands:
    echo   View logs:    docker-compose logs -f
    echo   Stop app:     docker-compose down
    echo   Restart:      docker-compose restart
    echo   View status:  docker-compose ps
    
    pause
) else (
    echo 🚀 Starting in foreground mode...
    echo    Press Ctrl+C to stop the application
    echo.
    docker-compose up --build
)

pause
