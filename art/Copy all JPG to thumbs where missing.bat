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

        :: Loop through each JPG file in the current folder
        for %%J in ("%%F\*.jpg") do (
            :: Check if the file already exists in the target "thumb" folder
            if not exist "%%F\thumb\%%~nxJ" (
                :: If it does NOT exist, then copy it
                echo Copying "%%~nxJ" to "%%F\thumb\"
                copy "%%J" "%%F\thumb\" > NUL
            ) else (
                :: If it DOES exist, skip it (no report)
                REM echo Skipping "%%~nxJ" in "%%F\thumb\" (already exists).
            )
        )
    ) else (
        echo Warning: Folder "%%F" does not exist!
    )
)

echo Done!
pause
endlocal
