@echo off
echo Creating PhaseState data folder...
mkdir "c:\Users\ThinkPad\Desktop\New folder (2)\public\data\PhaseState" 2>nul
echo Copying JSON files...
copy /Y "C:\Users\ThinkPad\Desktop\New folder (4)\PhaseState_JsonFiles\*.json" "c:\Users\ThinkPad\Desktop\New folder (2)\public\data\PhaseState\"
echo.
echo Done! Files copied successfully.
pause
