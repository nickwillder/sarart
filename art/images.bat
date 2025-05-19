@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

set "output_file=images.txt"

:: Delete the output file if it already exists, to start fresh
if exist "%output_file%" del "%output_file%" 2>nul

echo Generating CSV-like listing of JPG files...

:: Iterate through files in each specified directory and format the output

:: Process 'animals' subdirectory - Removed the if exist check
for %%F in (animals\*.jpg) do (
    echo animals,"%%~nF",animals >> "!output_file!" 2>nul
)

:: Process 'landscapes' subdirectory - Removed the if exist check
for %%F in (landscapes\*.jpg) do (
    echo "landscapes","%%~nF","landscapes" >> "!output_file!" 2>nul
)

:: Process 'people' subdirectory - Removed the if exist check
for %%F in (people\*.jpg) do (
    echo "people","%%~nF","people" >> "!output_file!" 2>nul
)

:: Process 'miscellaneous' subdirectory - Removed the if exist check
for %%F in (miscellaneous\*.jpg) do (
    echo "miscellaneous","%%~nF","miscellaneous" >> "!output_file!" 2>nul
)


echo.
echo CSV-like file listing complete.
echo Output saved to "!output_file!" in the current directory.

pause

ENDLOCAL