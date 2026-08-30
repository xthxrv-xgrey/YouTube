@echo off
title Full Stack Development

echo Starting Frontend...
start "client" /min cmd /k "cd /d "%~dp0client" && npm run start"

echo Starting Backend...
start "server" /min cmd /k "color a && cd /d "%~dp0server" && npm run start"

echo Waiting for servers to start...
timeout /t 5 /nobreak >nul

echo Opening browser...
start "" "http://localhost:5173"

echo.
echo ==============================
echo   Frontend and Backend Started
echo ==============================
echo.