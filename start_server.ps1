$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -LiteralPath $root

$port = 8010
while (Test-NetConnection -ComputerName 127.0.0.1 -Port $port -InformationLevel Quiet) {
  $port++
}

Write-Host "Serving TTE HTML5 Standard Views from $root"
Write-Host "Open http://127.0.0.1:$port/index.html"
python -m http.server $port --bind 127.0.0.1
