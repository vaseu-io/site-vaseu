$h = @{
    "User-Token" = "bGDwmLWbfgXKrflUhIKR"
    "User-Secret-Key" = "SKS93NhPSi6H2XrILcOk"
    "Content-Type" = "application/json"
}
try {
    $r = Invoke-RestMethod -Uri "https://api.dooki.com.br/v2/vaseu2/catalog/products?include=skus&limit=50" -Headers $h -Method GET
    foreach ($p in $r.data) {
        Write-Host "=== $($p.name) ==="
        foreach ($s in $p.skus.data) {
            $size = ($s.variations | Where-Object { $_.name -eq "Tamanho" }).value
            Write-Host "  $size => token:$($s.token) price:$($s.price_discount)"
        }
    }
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $reader.BaseStream.Position = 0
    Write-Host "BODY: $($reader.ReadToEnd())"
}
