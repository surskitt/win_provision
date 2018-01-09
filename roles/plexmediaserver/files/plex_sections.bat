@echo off

tasklist /FI "IMAGENAME eq Plex Media Server.exe" 2>NUL | find /I /N "Plex Media Server.exe">NUL
if "%ERRORLEVEL%"=="1" echo Plex is not running
if "%ERRORLEVEL%"=="1" goto FIN

:FOUND

set SCANNER="C:\Program Files (x86)\Plex\Plex Media Server\Plex Media Scanner.exe"

%SCANNER% -l 2>NUL | find /I /N "Anime">NUL
if "%ERRORLEVEL%"=="0" echo Anime section already added
if "%ERRORLEVEL%"=="1" %SCANNER% --add-section Anime --type 2 --location E:\Video\Anime

%SCANNER% -l 2>NUL | find /I /N "TV">NUL
if "%ERRORLEVEL%"=="0" echo TV section already added
if "%ERRORLEVEL%"=="1" %SCANNER% --add-section TV --type 2 --location E:\Video\TV

%SCANNER% -l 2>NUL | find /I /N "Films">NUL
if "%ERRORLEVEL%"=="0" echo Films section already added
if "%ERRORLEVEL%"=="1" %SCANNER% --add-section Films --type 1 --location E:\Video\Films

:FIN
set /p temp="Hit enter to continue"
