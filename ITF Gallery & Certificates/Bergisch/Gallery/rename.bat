@echo off
setlocal enabledelayedexpansion
set i=1
for %%a in (*.jpg *.jpeg *.png) do (
    ren "%%a" "!i!.jpg"
    set /a i=!i!+1
)
