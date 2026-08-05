[CmdletBinding()]
param(
    [string]$PeakEnvPath = 'C:\Users\Steven\Projects\telegram-personal-assistant\.env',
    [string]$CredentialPath = 'C:\Users\Steven\.peak-os\credentials\peak-dashboard-login.clixml',
    [string]$DashboardUrl = 'https://line101chat.com'
)

$ErrorActionPreference = 'Stop'

function ConvertTo-Base64Url {
    param([Parameter(Mandatory)][byte[]]$Value)
    [Convert]::ToBase64String($Value).TrimEnd('=').Replace('+', '-').Replace('/', '_')
}

$secretLine = Get-Content -LiteralPath $PeakEnvPath | Where-Object {
    $_ -match '^PEAK_DASHBOARD_SYNC_SECRET='
} | Select-Object -Last 1
if (-not $secretLine) {
    throw 'PEAK_DASHBOARD_SYNC_SECRET is not configured in the local Peak OS environment.'
}
$secret = ($secretLine -split '=', 2)[1].Trim().Trim('"').Trim("'")
if ($secret.Length -lt 32) {
    throw 'The local Peak dashboard synchronization secret is invalid.'
}
$credential = Import-Clixml -LiteralPath $CredentialPath
$now = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$payload = [ordered]@{
    v = 1
    email = $credential.UserName.Trim().ToLowerInvariant()
    iat = $now
    exp = $now + 120
    nonce = [Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(16)).ToLowerInvariant()
}
$json = $payload | ConvertTo-Json -Compress
$encoded = ConvertTo-Base64Url ([Text.Encoding]::UTF8.GetBytes($json))
$hmac = [Security.Cryptography.HMACSHA256]::new([Text.Encoding]::UTF8.GetBytes($secret))
try {
    $signature = [Convert]::ToHexString($hmac.ComputeHash([Text.Encoding]::UTF8.GetBytes($encoded))).ToLowerInvariant()
}
finally {
    $hmac.Dispose()
}
$url = "$($DashboardUrl.TrimEnd('/'))/peak/local-login#$encoded.$signature"
Start-Process $url
Write-Host 'Opened a one-time Peak OS sign-in link. It expires in two minutes and cannot be reused.' -ForegroundColor Green

$secret = $null
$signature = $null
$encoded = $null
$json = $null
$credential = $null
