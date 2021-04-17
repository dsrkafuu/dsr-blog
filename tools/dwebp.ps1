Write-Host("dwebp is running")
Write-Host("")
Get-ChildItem -Path .\* -Include *.webp | ForEach-Object -Process {
    $oldName = $_.Name
    $newName = $_.BaseName + ".png"
    dwebp.exe $oldName -o $newName
    # Pause
}
Pause
