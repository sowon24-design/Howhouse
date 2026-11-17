param(
  [Parameter(Mandatory=$true)][string]$AdbPath,
  [switch]$Install
)
$ErrorActionPreference = 'Stop'
$prototypeRoot = Split-Path $PSScriptRoot -Parent
$devices = @(& $AdbPath devices | Where-Object { $_ -match '^\S+\s+device$' } | ForEach-Object { ($_ -split '\s+')[0] })
if ($LASTEXITCODE -ne 0 -or $devices.Count -ne 1) { throw 'Connect exactly one USB-debugging authorized Android device.' }
$serial = $devices[0]
& $AdbPath -s $serial reverse tcp:8787 tcp:8787
if ($LASTEXITCODE -ne 0) { throw 'USB API forwarding failed.' }
if ($Install) {
  $apk = Join-Path $prototypeRoot 'capstone-android.local/android/app/build/outputs/apk/debug/app-debug.apk'
  if (!(Test-Path -LiteralPath $apk)) { throw 'Build the capstone debug APK first.' }
  & $AdbPath -s $serial install -r $apk
  if ($LASTEXITCODE -ne 0) { throw 'Install failed. Existing apps were not uninstalled.' }
  & $AdbPath -s $serial shell am start -n 'com.howhouse.capstone/com.howhouse.app.MainActivity'
  if ($LASTEXITCODE -ne 0) { throw 'Launch failed.' }
}
Write-Output 'Capstone USB API connection ready. Keep PC server running. No AI request was sent.'
