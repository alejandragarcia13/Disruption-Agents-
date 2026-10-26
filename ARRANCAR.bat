@echo off
REM Doble clic en este archivo para arrancar Disruption Agents
cd /d "%~dp0"
title Disruption Agents

where node >nul 2>nul
if errorlevel 1 goto sinnode

if exist node_modules goto instalado
echo.
echo  Primera vez: instalando lo necesario. Tarda 1 o 2 minutos...
echo.
call npm install
:instalado

echo.
echo  Preparando Stellar...
call npm run setup

echo.
echo  Abriendo la app en el navegador...
echo  IMPORTANTE: no cierres esta ventana negra mientras uses la app.
echo.
start "" cmd /c "timeout /t 4 >nul & start http://localhost:3000"
call npm start
pause
exit /b

:sinnode
echo.
echo  Falta instalar Node.js.
echo  Se va a abrir la web: descarga el boton verde LTS, instalalo
echo  y luego vuelve a hacer doble clic en ARRANCAR.bat
echo.
start "" https://nodejs.org
pause
