$shell = New-Object -ComObject WScript.Shell
$shortcuts = Get-ChildItem "$env:USERPROFILE\Desktop" -Filter "*.lnk"

foreach ($shortcut in $shortcuts) {
    $link = $shell.CreateShortcut($shortcut.FullName)
    Write-Host "$($shortcut.Name) -> $($link.TargetPath)"
}
