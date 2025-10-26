@echo off
echo Configurando variaveis de ambiente...
set ANDROID_HOME=C:\Users\victo\AppData\Local\Android\Sdk
set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.16.8-hotspot
set PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%PATH%

echo Iniciando Appium...
cd /d "C:\Users\victo\Projetos\outsera\avaliacao"
npx appium
