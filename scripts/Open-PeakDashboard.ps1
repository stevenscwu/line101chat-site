[CmdletBinding()]
param(
    [string]$PeakEnvPath = (Join-Path $env:USERPROFILE 'Projects\telegram-personal-assistant\.env'),
    [string]$CredentialPath = (Join-Path $env:USERPROFILE '.peak-os\credentials\peak-dashboard-login.clixml'),
    [string]$DashboardUrl = 'https://line101chat.com',
    [ValidateSet('/peak-os', '/peak', '/peak/password')]
    [string]$Destination = '/peak-os'
)

$ErrorActionPreference = 'Stop'

function ConvertTo-Base64Url {
    param([Parameter(Mandatory)][byte[]]$Value)
    [Convert]::ToBase64String($Value).TrimEnd('=').Replace('+', '-').Replace('/', '_')
}

function New-CryptographicRandomBytes {
    param([Parameter(Mandatory)][ValidateRange(1, 1024)][int]$Length)

    $bytes = New-Object byte[] $Length
    $generator = [Security.Cryptography.RandomNumberGenerator]::Create()
    try {
        $generator.GetBytes($bytes)
    }
    finally {
        $generator.Dispose()
    }
    return ,$bytes
}

function ConvertTo-LowerHex {
    param([Parameter(Mandatory)][byte[]]$Value)

    [BitConverter]::ToString($Value).Replace('-', '').ToLowerInvariant()
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
    nonce = ConvertTo-LowerHex (New-CryptographicRandomBytes 16)
}
$json = $payload | ConvertTo-Json -Compress
$encoded = ConvertTo-Base64Url ([Text.Encoding]::UTF8.GetBytes($json))
$hmac = [Security.Cryptography.HMACSHA256]::new([Text.Encoding]::UTF8.GetBytes($secret))
try {
    $signature = ConvertTo-LowerHex ($hmac.ComputeHash([Text.Encoding]::UTF8.GetBytes($encoded)))
}
finally {
    $hmac.Dispose()
}
$next = [Uri]::EscapeDataString($Destination)
$url = "$($DashboardUrl.TrimEnd('/'))/peak/local-login?next=$next#$encoded.$signature"
Start-Process $url
Write-Host 'Opened a one-time Peak OS sign-in link. It expires in two minutes and cannot be reused.' -ForegroundColor Green

$secret = $null
$signature = $null
$encoded = $null
$json = $null
$credential = $null
