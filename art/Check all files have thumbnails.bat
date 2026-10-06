@echo off
setlocal enabledelayedexpansion
cls
set "________=------------------------------------------------------------"


:: List of folders to process - ENSURE NO TRAILING SPACE AFTER "miscellaneous"
set "folders=animals landscapes people miscellaneous"

echo %________%

:: Loop through each main folder and call a subroutine for processing each
for %%F in (%folders%) do (
    call :ProcessFolder "%%F"
)

echo Comparison complete. Press any key to exit.
pause > nul
goto :end

:: ====================================================================
:: Subroutine to process a single folder
:: All folder existence checks have been removed as per user request.
:: ====================================================================
:ProcessFolder
set "current_folder=%~1"
:: Get the folder name passed as an argument (e.g., "animals")

::nick echo --- Processing folder: %current_folder% ---

:: Temporary files to store filenames for comparison
set "main_files_temp=%current_folder%_main_files.tmp"
set "thumb_files_temp=%current_folder%_thumb_files.tmp"

:: Get list of JPG filenames from the main folder (just filenames, no path)
dir /b /a-d "%current_folder%\*.jpg" > "!main_files_temp!"

:: Get list of JPG filenames from the "thumb" folder (just filenames, no path)
dir /b /a-d "%current_folder%\thumb\*.jpg" > "!thumb_files_temp!"

:: Check for files in main folder but NOT in thumb folder
::nick echo.
echo Files in '[96m%current_folder%\[37m' but NOT in '[94m%current_folder%\thumb\[37m':
findstr /v /g:"!thumb_files_temp!" "!main_files_temp!" > NUL
if errorlevel 1 goto :NoMainDifferencesFound
findstr /v /g:"!thumb_files_temp!" "!main_files_temp!"
goto :CheckThumbDifferences

:NoMainDifferencesFound
echo   (No differences found)

:CheckThumbDifferences
:: Check for files in thumb folder but NOT in main folder
::nick echo.
echo Files in '[94m%current_folder%\thumb\[37m' but NOT in '[96m%current_folder%\[37m':
findstr /v /g:"!main_files_temp!" "!thumb_files_temp!" > NUL
if errorlevel 1 goto :NoThumbDifferencesFound
findstr /v /g:"!main_files_temp!" "!thumb_files_temp!"
goto :CleanupTempFiles

:NoThumbDifferencesFound
echo   (No differences found)

:CleanupTempFiles
:: Clean up temporary files
del "!main_files_temp!"
del "!thumb_files_temp!"
echo %________%
goto :eof_subroutine :: Exit the subroutine normally


:: End of subroutine - returns to where it was called from
:eof_subroutine
goto :eof


:: ====================================================================
:: End of file / Cleanup section
:: Ensures proper cleanup before script termination
:: ====================================================================
:end
cls
endlocal
goto :eof
