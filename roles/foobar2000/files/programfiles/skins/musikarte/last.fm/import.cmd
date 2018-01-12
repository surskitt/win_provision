@ECHO off
TITLE Import Your Last.fm Library
COLOR 97
CLS
%4 %5
CLS
ECHO Progressing¡­
%1 %2 <%3
IF ERRORLEVEL 1 goto 1
IF ERRORLEVEL 0 goto 0
:0
CLS
COLOR 27
ECHO Success! Starting foobar2000...
goto start
:1
CLS
COLOR 47
ECHO Failed! Starting foobar2000...
goto start
:start
TIMEOUT /T 5
start %4
