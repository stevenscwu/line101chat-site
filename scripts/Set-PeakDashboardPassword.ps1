[CmdletBinding()]
param(
    [string]$OwnerEmail = '',
    [string]$DashboardUrl = 'https://line101chat.com',
    [string]$PeakEnvPath = (Join-Path $env:USERPROFILE 'Projects\telegram-personal-assistant\.env'),
    [string]$CredentialPath = (Join-Path $env:USERPROFILE '.peak-os\credentials\peak-dashboard-login.clixml'),
    [string]$StatusPath = ''
)

$ErrorActionPreference = 'Stop'

function ConvertFrom-ProtectedInput {
    param([Parameter(Mandatory)][Security.SecureString]$Value)

    $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Value)
    try {
        [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
    }
    finally {
        if ($pointer -ne [IntPtr]::Zero) {
            [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
        }
    }
}

function ConvertTo-Base64Url {
    param([Parameter(Mandatory)][byte[]]$Value)

    [Convert]::ToBase64String($Value).TrimEnd('=').Replace('+', '-').Replace('/', '_')
}

function New-LocalLoginToken {
    param(
        [Parameter(Mandatory)][string]$Email,
        [Parameter(Mandatory)][string]$Secret
    )

    $now = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
    $payload = [ordered]@{
        v = 1
        email = $Email.Trim().ToLowerInvariant()
        iat = $now
        exp = $now + 120
        nonce = [Convert]::ToHexString(
            [Security.Cryptography.RandomNumberGenerator]::GetBytes(16)
        ).ToLowerInvariant()
    }
    $encoded = ConvertTo-Base64Url (
        [Text.Encoding]::UTF8.GetBytes(($payload | ConvertTo-Json -Compress))
    )
    $hmac = [Security.Cryptography.HMACSHA256]::new(
        [Text.Encoding]::UTF8.GetBytes($Secret)
    )
    try {
        $signature = [Convert]::ToHexString(
            $hmac.ComputeHash([Text.Encoding]::UTF8.GetBytes($encoded))
        ).ToLowerInvariant()
    }
    finally {
        $hmac.Dispose()
    }
    "$encoded.$signature"
}

try {
    Write-Host 'Peak OS password setup' -ForegroundColor Cyan
    Write-Host 'The password is sent only through an authenticated recovery session.'
    Write-Host 'The live server stores only a one-way password verifier.'
    Write-Host ''

    $protectedPassword = Read-Host 'Choose your Peak OS password (minimum 12 characters)' -AsSecureString
    $protectedConfirmation = Read-Host 'Enter the same password again' -AsSecureString
    $password = ConvertFrom-ProtectedInput $protectedPassword
    $confirmation = ConvertFrom-ProtectedInput $protectedConfirmation
    if ($password.Length -lt 12 -or $password.Length -gt 256) {
        throw 'The password must contain between 12 and 256 characters.'
    }
    if ($password -cne $confirmation) {
        throw 'The two passwords do not match.'
    }
    if (-not $OwnerEmail -and (Test-Path -LiteralPath $CredentialPath)) {
        $OwnerEmail = (Import-Clixml -LiteralPath $CredentialPath).UserName
    }
    if (-not $OwnerEmail) {
        $OwnerEmail = (Read-Host 'Owner email').Trim()
    }
    if ($OwnerEmail -notmatch '^[^@\s]+@[^@\s]+\.[^@\s]+$') {
        throw 'Enter a valid owner email.'
    }

    $secretLine = Get-Content -LiteralPath $PeakEnvPath | Where-Object {
        $_ -match '^PEAK_DASHBOARD_SYNC_SECRET='
    } | Select-Object -Last 1
    if (-not $secretLine) {
        throw 'Peak dashboard synchronization is not configured on this computer.'
    }
    $syncSecret = ($secretLine -split '=', 2)[1].Trim().Trim('"').Trim("'")
    if ($syncSecret.Length -lt 32) {
        throw 'Peak dashboard synchronization configuration is invalid.'
    }

    $baseUrl = $DashboardUrl.TrimEnd('/')
    $session = [Microsoft.PowerShell.Commands.WebRequestSession]::new()
    $token = New-LocalLoginToken -Email $OwnerEmail -Secret $syncSecret
    $recovery = Invoke-WebRequest -UseBasicParsing -Method Post `
        -Uri "$baseUrl/api/peak/v1/local-login" `
        -WebSession $session `
        -Headers @{ Origin = $baseUrl } `
        -ContentType 'application/json' `
        -Body (@{ token = $token } | ConvertTo-Json -Compress)
    if ($recovery.StatusCode -ne 200) {
        throw 'The trusted local recovery session was rejected.'
    }

    $body = @{ password = $password; confirmation = $confirmation } | ConvertTo-Json -Compress
    $update = Invoke-WebRequest -UseBasicParsing -Method Post `
        -Uri "$baseUrl/api/peak/v1/password" `
        -WebSession $session `
        -Headers @{ Origin = $baseUrl } `
        -ContentType 'application/json' `
        -Body $body
    $result = $update.Content | ConvertFrom-Json
    if ($update.StatusCode -ne 200 -or $result.updated -ne $true) {
        throw 'The live dashboard did not confirm the password update.'
    }

    # Persist locally only after the live durable verifier has been read back and verified.
    $credentialDirectory = Split-Path -Parent $CredentialPath
    New-Item -ItemType Directory -Path $credentialDirectory -Force | Out-Null
    $credential = [Management.Automation.PSCredential]::new($OwnerEmail, $protectedPassword)
    $credential | Export-Clixml -LiteralPath $CredentialPath -Force

    if ($StatusPath) {
        Set-Content -LiteralPath $StatusPath -Value 'success' -Encoding ascii
    }
    Write-Host ''
    Write-Host 'Live password updated and protected local credential synchronized.' -ForegroundColor Green
}
catch {
    if ($StatusPath) {
        Set-Content -LiteralPath $StatusPath -Value 'failed' -Encoding ascii
    }
    Write-Host ''
    Write-Host "Password setup failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
finally {
    $password = $null
    $confirmation = $null
    $credential = $null
    $protectedPassword = $null
    $protectedConfirmation = $null
    $syncSecret = $null
    $token = $null
    $body = $null
}
