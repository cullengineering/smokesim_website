@echo off
cls
echo.
echo ================================================================
echo                  SMOKESIM WEBSITE LAUNCHER                   
echo              Build + Preview + Browser Launch               
echo ================================================================
echo.

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found. Install from: https://nodejs.org/
    timeout /t 10
    exit /b 1
)

REM Install deps silently
echo Installing dependencies...
call npm install --silent >nul 2>&1

REM Clean previous build
if exist "dist" rmdir /s /q "dist" >nul 2>&1

REM Quality checks
echo Running quality checks...
call npm run lint >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Code quality issues found
    call npm run lint
    timeout /t 5
    exit /b 1
)

call npm run type-check >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: TypeScript errors found
    call npm run type-check
    timeout /t 5
    exit /b 1
)

REM Build
echo Building website...
call npm run build >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    call npm run build
    timeout /t 5
    exit /b 1
)

REM Check if dev server is already running on port 3000
netstat -an | findstr ":3000" >nul 2>&1
if %errorlevel% equ 0 (
    echo Development server already running - opening browser...
    start "" "http://localhost:3000/smokesim_website/"
) else (
    echo Starting development server...
    start /min cmd /c "npm run dev"
    timeout /t 4 /nobreak >nul
    echo Opening browser...
    start "" "http://localhost:3000/smokesim_website/"
)

echo.
echo SUCCESS: Website ready at http://localhost:3000/smokesim_website/
echo.
echo Press any key to close...
pause >nul