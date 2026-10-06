@echo off
cls
SETLOCAL ENABLEDELAYEDEXPANSION
set "_=[91m----------------------------------------------------------------------[0m"

set "output_file=images.txt"

:: Delete the output file if it already exists, to start fresh
if exist "%output_file%" del "%output_file%" 2>nul

echo %_%
echo [1mDOS BATCH FILE PROCESSING[22m
echo Generating CSV-like listing of JPG files...

:: Iterate through files in each specified directory and format the output

:: Process 'animals' subdirectory
for %%F in (animals\*.jpg) do (
    echo animals,"%%~nF",animals >> "!output_file!" 2>nul
)

:: Process 'landscapes' subdirectory
for %%F in (landscapes\*.jpg) do (
    echo "landscapes","%%~nF","landscapes" >> "!output_file!" 2>nul
)

:: Process 'people' subdirectory
for %%F in (people\*.jpg) do (
    echo "people","%%~nF","people" >> "!output_file!" 2>nul
)

:: Process 'miscellaneous' subdirectory
for %%F in (miscellaneous\*.jpg) do (
    echo "miscellaneous","%%~nF","miscellaneous" >> "!output_file!" 2>nul
)


echo CSV-like file listing complete.
echo Output saved to "!output_file!" in the current directory.

echo %_%
echo [1mPYTHON PROCESSING[22m

python images.py

echo %_%

ENDLOCAL
echo Any key to quit...
pause > NUL
goto :eof