[CmdletBinding()]
param()

$secure = Read-Host 'Enter the Peak OS dashboard password' -AsSecureString
$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
try {
    $password = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
    if ($password.Length -lt 12) {
        throw 'Use a password containing at least 12 characters.'
    }
    $salt = New-Object byte[] 24
    $generator = [Security.Cryptography.RandomNumberGenerator]::Create()
    try {
        $generator.GetBytes($salt)
    }
    finally {
        $generator.Dispose()
    }
    $iterations = 310000
    $derive = [Security.Cryptography.Rfc2898DeriveBytes]::new(
        $password,
        $salt,
        $iterations,
        [Security.Cryptography.HashAlgorithmName]::SHA512
    )
    try {
        $digest = $derive.GetBytes(64)
    }
    finally {
        $derive.Dispose()
    }
    $encode = {
        param([byte[]]$bytes)
        [Convert]::ToBase64String($bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_')
    }
    $saltEncoded = & $encode $salt
    $digestEncoded = & $encode $digest
    "pbkdf2-sha512`$$iterations`$$saltEncoded`$$digestEncoded"
}
finally {
    if ($pointer -ne [IntPtr]::Zero) {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
    }
    $password = $null
}
