@echo off
setlocal

set BASE_DIR=%~dp0
set PROJECT_DIR=%BASE_DIR%
if "%PROJECT_DIR:~-1%"=="\" set PROJECT_DIR=%PROJECT_DIR:~0,-1%
set WRAPPER_JAR=%BASE_DIR%.mvn\wrapper\maven-wrapper.jar
set WRAPPER_PROPERTIES=%BASE_DIR%.mvn\wrapper\maven-wrapper.properties

if not exist "%WRAPPER_JAR%" (
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$wrapperUrl = (Get-Content '%WRAPPER_PROPERTIES%' | Where-Object { $_ -like 'wrapperUrl=*' }) -replace '^wrapperUrl=', ''; Invoke-WebRequest -Uri $wrapperUrl -OutFile '%WRAPPER_JAR%'"
  if errorlevel 1 (
    echo Failed to download Maven Wrapper jar.
    exit /b 1
  )
)

java "-Dmaven.multiModuleProjectDirectory=%PROJECT_DIR%" -classpath "%WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
endlocal
