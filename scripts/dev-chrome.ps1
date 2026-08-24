$ErrorActionPreference = "Stop"

function Test-PortAvailable {
  param([int]$Port)

  try {
    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
    $listener.Start()
    $listener.Stop()
    return $true
  } catch {
    return $false
  }
}

$port = 3000
while (-not (Test-PortAvailable -Port $port)) {
  $port += 1
}

$url = "http://localhost:$port"
$apiUrl = "http://localhost:8000"

if (Test-PortAvailable -Port 8000) {
  Write-Host "Starting Laravel API at $apiUrl"
  Start-Process -FilePath "powershell.exe" -ArgumentList @(
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-Command",
    "cd '$PSScriptRoot\..\backend'; php artisan serve --host=127.0.0.1 --port=8000"
  ) -WindowStyle Hidden
} else {
  Write-Host "Laravel API port 8000 is already in use. Using existing server."
}

$apiReady = $false
for ($attempt = 1; $attempt -le 20; $attempt += 1) {
  try {
    $response = Invoke-WebRequest -Uri "$apiUrl/up" -UseBasicParsing -TimeoutSec 2
    if ($response.StatusCode -eq 200) {
      $apiReady = $true
      break
    }
  } catch {
    Start-Sleep -Milliseconds 500
  }
}

if ($apiReady) {
  Write-Host "Laravel API is ready."
} else {
  Write-Host "Laravel API is still starting. The page will retry video loading automatically."
}

Start-Job -ScriptBlock {
  param($TargetUrl)
  Start-Sleep -Seconds 2

  try {
    Start-Process "chrome.exe" $TargetUrl
  } catch {
    Start-Process $TargetUrl
  }
} -ArgumentList $url | Out-Null

Write-Host "Opening Chrome at $url"
npx next dev -p $port
