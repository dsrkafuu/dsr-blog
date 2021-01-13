Write-Host("cwebp running in lossy mode,")
Write-Host("in which a small quality factor produces a smaller file with lower quality.,")
Write-Host("Best quality is achieved by using a value of 100.")
$quality = Read-Host "Please input quality: "
Write-Host("")
Get-ChildItem -Path .\* -Include *.jpg, *.png | ForEach-Object -Process {
    $oldName = $_.Name
    $newName = $_.BaseName + ".webp"
    cwebp.exe -q $quality $oldName -o $newName
    # Pause
}
Pause
