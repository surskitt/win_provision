@echo off

tasklist /FI "IMAGENAME eq Plex Media Server.exe" 2>NUL | find /I /N "Plex Media Server.exe">NUL
if "%ERRORLEVEL%"=="1" echo Plex is not running
if "%ERRORLEVEL%"=="1" goto FIN

:FOUND

set SCANNER="C:\Program Files (x86)\Plex\Plex Media Server\Plex Media Scanner.exe"

%SCANNER% -l 2>NUL | find /I /N "Anime">NUL
if "%ERRORLEVEL%"=="0" echo Anime section already added
if "%ERRORLEVEL%"=="1" %SCANNER% --add-section Anime --type 2 --location E:\Video\Anime

if "%ERRORLEVEL%"=="0" echo TV section already added
%SCANNER% -l 2>NUL | find /I /N "TV">NUL
if "%ERRORLEVEL%"=="1" %SCANNER% --add-section TV --type 2 --location E:\Video\TV

if "%ERRORLEVEL%"=="0" echo Film section already added
%SCANNER% -l 2>NUL | find /I /N "Film">NUL
if "%ERRORLEVEL%"=="1" %SCANNER% --add-section Film --type 2 --location E:\Video\Film

set /p temp="Hit enter to continue"
:FIN