@echo off
chcp 65001 >nul
echo ========================================
echo    体重记录 App - 发布版本构建脚本
echo ========================================
echo.

REM 检查 JAVA_HOME
if "%JAVA_HOME%"=="" (
    echo [错误] 未设置 JAVA_HOME 环境变量
    echo.
    echo 请先安装 Java JDK 并设置环境变量。
    pause
    exit /b 1
)

echo [✓] JAVA_HOME: %JAVA_HOME%
echo.

REM 检查 ANDROID_HOME
if "%ANDROID_HOME%"=="" (
    echo [错误] 未设置 ANDROID_HOME 环境变量
    echo.
    echo 请先安装 Android Studio 并设置环境变量。
    pause
    exit /b 1
)

echo [✓] ANDROID_HOME: %ANDROID_HOME%
echo.

REM 检查密钥库
if not exist "release-key.keystore" (
    echo.
    echo [提示] 未找到签名密钥库。
    echo.
    set /p CREATE_KEY="是否现在创建密钥库？(Y/N): "
    if /i "%CREATE_KEY%"=="Y" (
        echo.
        echo 正在创建密钥库...
        echo.
        keytool -genkey -v -keystore release-key.keystore -alias weight-tracker -keyalg RSA -keysize 2048 -validity 10000
        if %ERRORLEVEL% NEQ 0 (
            echo [错误] 密钥库创建失败！
            pause
            exit /b 1
        )
        echo.
        echo [✓] 密钥库创建成功！
        echo.
    ) else (
        echo.
        echo [警告] 将生成未签名的 APK。未签名的 APK 无法安装到设备上。
        echo.
        set /p CONTINUE="是否继续？(Y/N): "
        if /i not "%CONTINUE%"=="Y" (
            pause
            exit /b 1
        )
    )
)

echo 开始构建发布版本 APK...
echo.

cordova build android --release

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [错误] 构建失败！
    echo.
    pause
    exit /b 1
)

if exist "release-key.keystore" (
    echo.
    echo 正在签名 APK...
    echo.
    jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore release-key.keystore platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk weight-tracker

    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [错误] 签名失败！
        echo.
        pause
        exit /b 1
    )

    echo.
    echo [✓] APK 签名成功！
)

echo.
echo ========================================
echo    构建成功！
echo ========================================
echo.

if exist "release-key.keystore" (
    echo 已签名的 APK 文件位置:
    echo   platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk
) else (
    echo 未签名的 APK 文件位置:
    echo   platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk
    echo.
    echo 注意: 未签名的 APK 无法安装到设备上。
    echo 请使用 jarsigner 对其进行签名。
)

echo.
pause
