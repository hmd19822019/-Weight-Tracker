@echo off
chcp 65001 >nul
echo ========================================
echo    体重记录 App - 测试服务器
echo ========================================
echo.
echo 启动本地测试服务器...
echo.
echo 测试完成后，按 Ctrl+C 停止服务器。
echo.

cordova serve

pause
