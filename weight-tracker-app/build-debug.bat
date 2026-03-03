@echo off
chcp 65001 >nul
echo ========================================
echo    体重记录 App - 构建脚本
echo ========================================
echo.

REM 检查 JAVA_HOME
if "%JAVA_HOME%"=="" (
    echo [错误] 未设置 JAVA_HOME 环境变量
    echo.
    echo 请先安装 Java JDK 并设置环境变量：
    echo   1. 下载安装 Java JDK: https://www.oracle.com/java/technologies/downloads/
    echo   2. 设置环境变量:
    echo      setx JAVA_HOME "C:\Program Files\Java\jdk-XX"
    echo.
    pause
    exit /b 1
)

echo [✓] JAVA_HOME: %JAVA_HOME%
echo.

REM 检查 ANDROID_HOME
if "%ANDROID_HOME%"=="" (
    echo [错误] 未设置 ANDROID_HOME 环境变量
    echo.
    echo 请先安装 Android Studio 并设置环境变量：
    echo   1. 下载安装 Android Studio: https://developer.android.com/studio
    echo   2. 设置环境变量:
    echo      setx ANDROID_HOME "%LOCALAPPDATA%\Android\Sdk"
    echo      setx PATH "%PATH%;%LOCALAPPDATA%\Android\Sdk\platform-tools;%LOCALAPPDATA%\Android\Sdk\tools;%LOCALAPPDATA%\Android\Sdk\tools\bin"
    echo.
    pause
    exit /b 1
)

echo [✓] ANDROID_HOME: %ANDROID_HOME%
echo.

echo 开始构建调试版本 APK...
echo.

cordova build android --debug

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [错误] 构建失败！
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo    构建成功！
echo ========================================
echo.
echo APK 文件位置:
echo   platforms\android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 你可以将此 APK 复制到 Android 设备上安装。
echo.
pause
