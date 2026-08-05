[CmdletBinding()]
param(
    [string]$OwnerEmail = 'stevenscwu@gmail.com',
    [string]$VercelProjectPath = 'C:\line101chat-site',
    [string]$CredentialPath = 'C:\Users\Steven\.peak-os\credentials\peak-dashboard-login.clixml',
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

try {
    Write-Host 'Peak OS password setup' -ForegroundColor Cyan
    Write-Host 'The password remains local; only its one-way hash is sent to Vercel.'
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

    $salt = [Security.Cryptography.RandomNumberGenerator]::GetBytes(24)
    $derive = [Security.Cryptography.Rfc2898DeriveBytes]::new(
        $password,
        $salt,
        310000,
        [Security.Cryptography.HashAlgorithmName]::SHA512
    )
    try {
        $digest = $derive.GetBytes(64)
        $hash = 'pbkdf2-sha512$310000$' +
            (ConvertTo-Base64Url $salt) + '$' +
            (ConvertTo-Base64Url $digest)
    }
    finally {
        $derive.Dispose()
    }

    Push-Location $VercelProjectPath
    try {
        $hash | & npx --yes vercel@latest env add `
            PEAK_DASHBOARD_PASSWORD_HASH production --force --yes --sensitive
        if ($LASTEXITCODE -ne 0) {
            throw 'Vercel rejected the password hash.'
        }
    }
    finally {
        Pop-Location
    }

    $credentialDirectory = Split-Path -Parent $CredentialPath
    New-Item -ItemType Directory -Path $credentialDirectory -Force | Out-Null
    $credential = [Management.Automation.PSCredential]::new($OwnerEmail, $protectedPassword)
    $credential | Export-Clixml -LiteralPath $CredentialPath -Force

    if ($StatusPath) {
        Set-Content -LiteralPath $StatusPath -Value 'success' -Encoding ascii
    }
    Write-Host ''
    Write-Host 'Password setup completed successfully.' -ForegroundColor Green
    Read-Host 'Press Enter to close this window'
}
catch {
    if ($StatusPath) {
        Set-Content -LiteralPath $StatusPath -Value 'failed' -Encoding ascii
    }
    Write-Host ''
    Write-Host "Password setup failed: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host 'Press Enter to close this window'
    exit 1
}
finally {
    $password = $null
    $confirmation = $null
    $hash = $null
    $digest = $null
    $salt = $null
    $credential = $null
    $protectedPassword = $null
    $protectedConfirmation = $null
}
