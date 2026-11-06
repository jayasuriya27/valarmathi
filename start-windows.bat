@echo off
cd /d "%~dp0"
echo.
echo === Valarmathi website: first time setup ===
echo.
call npm install
if errorlevel 1 (
  echo npm install failed. Is Node.js installed?
  pause
  exit /b 1
)
node scripts\first-run.mjs
if errorlevel 1 (
  pause
  exit /b 1
)
echo.
echo Starting website. Open http://localhost:3000 in Chrome.
echo.
call npm run dev
pause
