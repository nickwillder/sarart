@echo off
setlocal enabledelayedexpansion

:: List of folders to process
set "folders=animals landscapes people miscellaneous"

:: Loop through each folder
for %%F in (%folders%) do (
    if exist "%%F" (
        echo Processing folder: %%F

        :: Create "thumb" subdirectory if it doesn't exist
        if not exist "%%F\thumb" mkdir "%%F\thumb"

        :: Copy all JPG files to the "thumb" subdirectory
        copy "%%F\*.jpg" "%%F\thumb\" /Y
    ) else (
        echo Warning: Folder "%%F" does not exist!
    )
)

echo Done!
pause
endlocal
