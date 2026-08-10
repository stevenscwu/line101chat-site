[CmdletBinding()]
param(
    [string]$DashboardUrl = 'https://line101chat.com',
    [string]$PeakEnvPath = (Join-Path $env:USERPROFILE 'Projects\telegram-personal-assistant\.env'),
    [string]$CredentialPath = (Join-Path $env:USERPROFILE '.peak-os\credentials\peak-dashboard-login.clixml')
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

$secretLine = Get-Content -LiteralPath $PeakEnvPath | Where-Object { $_ -match '^PEAK_DASHBOARD_SYNC_SECRET=' } | Select-Object -Last 1
if (-not $secretLine) { throw 'Peak dashboard synchronization is not configured.' }
$syncSecret = ($secretLine -split '=', 2)[1].Trim().Trim('"').Trim("'")
if ($syncSecret.Length -lt 32) { throw 'Peak dashboard synchronization configuration is invalid.' }

$credential = Import-Clixml -LiteralPath $CredentialPath
$password = $credential.GetNetworkCredential().Password
if ($password.Length -lt 12 -or $password.Length -gt 256) { throw 'The protected credential contains an invalid password length.' }

$salt = New-CryptographicRandomBytes 24
$derive = [Security.Cryptography.Rfc2898DeriveBytes]::new($password, $salt, 310000, [Security.Cryptography.HashAlgorithmName]::SHA512)
try { $digest = $derive.GetBytes(64) } finally { $derive.Dispose() }
$hash = 'pbkdf2-sha512$310000$' + (ConvertTo-Base64Url $salt) + '$' + (ConvertTo-Base64Url $digest)
$body = @{ password_hash = $hash } | ConvertTo-Json -Compress
$timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds().ToString()
$nonce = ConvertTo-LowerHex (New-CryptographicRandomBytes 16)
$signed = "$timestamp.$nonce.$body"
$hmac = [Security.Cryptography.HMACSHA256]::new([Text.Encoding]::UTF8.GetBytes($syncSecret))
try { $signature = ConvertTo-LowerHex ($hmac.ComputeHash([Text.Encoding]::UTF8.GetBytes($signed))) } finally { $hmac.Dispose() }

try {
    $response = Invoke-WebRequest -UseBasicParsing -Method Post -Uri "$($DashboardUrl.TrimEnd('/'))/api/peak/v1/password/bootstrap" -ContentType 'application/json' -Body $body -Headers @{
        'X-Peak-Timestamp' = $timestamp
        'X-Peak-Nonce' = $nonce
        'X-Peak-Signature' = $signature
    }
    if ($response.StatusCode -ne 200) { throw 'The server did not confirm password initialization.' }
    Write-Host 'Peak OS durable dashboard password initialized and read-back verified.' -ForegroundColor Green
}
finally {
    $password = $null; $credential = $null; $syncSecret = $null; $hash = $null; $body = $null
    $digest = $null; $salt = $null; $signature = $null; $signed = $null
}
