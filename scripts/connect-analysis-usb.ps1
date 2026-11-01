param(
  [string]$AdbPath = '',
  [switch]$CheckOnly,
  [switch]$Disconnect
)
$ErrorActionPreference = 'Stop'
if (!$AdbPath) {
  $command = Get-Command adb -ErrorAction SilentlyContinue
  if ($command) { $AdbPath = $command.Source }
  elseif (Test-Path -LiteralPath "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe") {
    $AdbPath = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
  }
}
if (!$AdbPath -or !(Test-Path -LiteralPath $AdbPath)) {
  throw 'ADB를 찾지 못했습니다. Android Studio의 SDK Platform-Tools 또는 Google 공식 Platform-Tools를 준비한 뒤 -AdbPath로 adb.exe 경로를 지정하세요.'
}
$lines = @(& $AdbPath devices)
if ($LASTEXITCODE -ne 0) { throw 'USB 연결 목록을 읽지 못했습니다.' }
$ready = @($lines | Where-Object { $_ -match '^\S+\s+device$' })
if ($lines -match '\s+unauthorized$') { throw '휴대폰 잠금을 풀고 이 PC의 USB 디버깅 허용을 직접 확인하세요. 인증을 우회하지 않습니다.' }
if ($ready.Count -ne 1) { throw '승인된 Android 기기를 정확히 1대 연결하세요. 여러 기기 중 임의로 선택하지 않습니다.' }
$serial = ($ready[0] -split '\s+')[0]
if ($CheckOnly) { Write-Output 'USB_DEVICE_READY: 승인된 기기 1대. 포트 연결/분석 호출은 하지 않았습니다.'; return }
foreach ($port in @(5173, 8787)) {
  if ($Disconnect) { & $AdbPath -s $serial reverse --remove "tcp:$port" }
  else { & $AdbPath -s $serial reverse "tcp:$port" "tcp:$port" }
  if ($LASTEXITCODE -ne 0) { throw "USB 포트 $port 연결 작업 실패. 자동 반복하지 않습니다." }
}
if ($Disconnect) { Write-Output 'USB_PORTS_REMOVED: 이 프로젝트의 5173/8787 연결만 제거했습니다.' }
else { Write-Output 'USB_PORTS_READY: 휴대폰 Chrome에서 http://127.0.0.1:5173/#problem 을 직접 여세요. 새 분석 버튼은 유료 호출일 수 있습니다.' }
