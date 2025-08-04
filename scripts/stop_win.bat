@echo off
setlocal enabledelayedexpansion

rem Ports to stop
set PORTS=3000 3001

for %%P in (%PORTS%) do (
  echo Stopping processes listening on port %%P...
  for /f "tokens=5" %%A in ('netstat -ano ^| findstr :%%P ^| find "LISTENING"') do (
    echo → Killing PID %%A
    taskkill /PID %%A /T /F >nul 2>&1 && (
      echo   PID %%A stopped.
    ) || (
      echo   Failed to stop PID %%A.
    )
  )
)

echo.
echo All done.
endlocal
