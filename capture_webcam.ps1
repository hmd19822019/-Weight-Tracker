Add-Type -AssemblyName System.Drawing

# Create a temporary file for the capture
$outputPath = "D:\openclaw-workspace\webcam_capture.jpg"

# Use PowerShell to capture from webcam using .NET
try {
    # Load Windows Runtime assemblies
    [Windows.Media.Capture.MediaCapture, Windows.Media, ContentType = WindowsRuntime] | Out-Null
    [Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
    
    $capture = New-Object Windows.Media.Capture.MediaCapture
    $capture.InitializeAsync().GetAwaiter().GetResult()
    
    $file = [Windows.Storage.StorageFile]::GetFileFromPathAsync($outputPath).GetAwaiter().GetResult()
    $capture.CapturePhotoToStorageFileAsync([Windows.Media.MediaProperties.ImageEncodingProperties]::CreateJpeg(), $file).GetAwaiter().GetResult()
    
    $capture.Dispose()
    Write-Host "Photo captured successfully to $outputPath"
} catch {
    Write-Host "Error: $_"
    exit 1
}
