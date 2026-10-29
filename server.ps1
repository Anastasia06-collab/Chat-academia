$port = 8080
$workspace = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $workspace) { $workspace = "c:\Users\user\проекты\Chat-academia" }

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "HTTP server started at http://localhost:$port/"
} catch {
    $port = 5500
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
    Write-Host "HTTP server started at http://localhost:$port/"
}

Start-Process "http://localhost:$port/"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/" -or [string]::IsNullOrWhiteSpace($localPath)) {
            $localPath = "/index.html"
        }

        $cleanRelPath = ($localPath.TrimStart('/')).Replace('/', '\')
        $filePath = Join-Path $workspace $cleanRelPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".htm"  { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".svg"  { "image/svg+xml" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".ico"  { "image/x-icon" }
                default { "application/octet-stream" }
            }
            $response.ContentType = $mime
            $response.Headers.Add("Cache-Control", "no-cache")
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.StatusCode = 200
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("File Not Found")
            $response.ContentLength64 = $errBytes.Length
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    } catch {
        # ignore context errors and continue serving
    }
}

