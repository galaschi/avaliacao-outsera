# ApiDemos APK

Este diretório contém o APK de exemplo usado nos testes mobile.

## Download do ApiDemos-debug.apk

Execute um dos comandos abaixo para baixar o APK:

### Opção 1: PowerShell (recomendado)
```powershell
Invoke-WebRequest -Uri "https://github.com/appium/appium/raw/master/packages/appium/sample-code/apps/ApiDemos-debug.apk" -OutFile "mobile/apps/ApiDemos-debug.apk"
```

### Opção 2: Download manual
1. Acesse: https://github.com/appium/appium/tree/master/packages/appium/sample-code/apps
2. Clique em `ApiDemos-debug.apk`
3. Clique em "Download" ou "Raw"
4. Salve o arquivo neste diretório: `mobile/apps/ApiDemos-debug.apk`

## Verificação

Após o download, verifique se o arquivo existe:

```powershell
# PowerShell
Test-Path mobile/apps/ApiDemos-debug.apk
# Deve retornar: True
```

Tamanho esperado: ~2.3 MB

## Aplicativo

**ApiDemos** é um aplicativo de exemplo fornecido pelo Google e usado pela comunidade Appium para demonstrar automação de testes Android.

Principais funcionalidades testadas:
- **App > Activity > Custom Title**: Navegação e inputs
- **Views > Controls > Light Theme**: Formulários com checkboxes, radio buttons, toggle, text fields
