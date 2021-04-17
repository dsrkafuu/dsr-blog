Write-Host("cwebp running in lossless mode,")
Write-Host("in which a small quality factor enables faster compression speed, but produces a larger file.")
Write-Host("Maximum compression is achieved by using a value of 100.")
# $quality = Read-Host "Please input quality: "
Write-Host("")
Get-ChildItem -Path .\* -Include *.jpg, *.png | ForEach-Object -Process {
    $oldName = $_.Name
    $newName = $_.BaseName + ".webp"
    cwebp.exe -lossless -q 100 $oldName -o $newName
    # Pause
}
Pause
