$h = @{
    "User-Token" = "Ol2JwcBDIZ6wXS5kJ8hlmNIZRuAS1B0ylZqAYmFM"
    "User-Secret-Key" = "sk_8xa8rSlVAufkmWdwxTpVgRgKjFlf8oWbGlDS8"
    "Content-Type" = "application/json"
}

# Check page 2 and search for conjunto/shorts
$output = "=== Page 2 ===`n"
try {
    $r2 = Invoke-RestMethod -Uri "https://api.dooki.com.br/v2/vaseu2/catalog/products?include=skus&limit=50&page=2" -Headers $h -Method GET
    if ($r2.data.Count -gt 0) {
        foreach ($p in $r2.data) {
            $output += "  $($p.name) (active:$($p.active))`n"
        }
    } else {
        $output += "  No products on page 2`n"
    }
} catch {
    $output += "  Error: $($_.Exception.Message)`n"
}

# Also search Yampi for "conjunto" explicitly
$output += "`n=== Search 'conjunto' ===`n"
try {
    $r3 = Invoke-RestMethod -Uri "https://api.dooki.com.br/v2/vaseu2/catalog/products?include=skus&limit=50&search=conjunto" -Headers $h -Method GET
    if ($r3.data.Count -gt 0) {
        foreach ($p in $r3.data) {
            $output += "  $($p.name) (active:$($p.active))`n"
            foreach ($s in $p.skus.data) {
                $size = ($s.variations | Where-Object { $_.name -eq "Tamanho" }).value
                $output += "    $size => token:$($s.token) price:$($s.price_discount)`n"
            }
        }
    } else {
        $output += "  No results`n"
    }
} catch {
    $output += "  Error: $($_.Exception.Message)`n"
}

# Search for "shorts"
$output += "`n=== Search 'shorts' ===`n"
try {
    $r4 = Invoke-RestMethod -Uri "https://api.dooki.com.br/v2/vaseu2/catalog/products?include=skus&limit=50&search=shorts" -Headers $h -Method GET
    if ($r4.data.Count -gt 0) {
        foreach ($p in $r4.data) {
            $output += "  $($p.name) (active:$($p.active))`n"
            foreach ($s in $p.skus.data) {
                $size = ($s.variations | Where-Object { $_.name -eq "Tamanho" }).value
                $output += "    $size => token:$($s.token) price:$($s.price_discount)`n"
            }
        }
    } else {
        $output += "  No results`n"
    }
} catch {
    $output += "  Error: $($_.Exception.Message)`n"
}

# Search for "basic"
$output += "`n=== Search 'basic' ===`n"
try {
    $r5 = Invoke-RestMethod -Uri "https://api.dooki.com.br/v2/vaseu2/catalog/products?include=skus&limit=50&search=basic" -Headers $h -Method GET
    if ($r5.data.Count -gt 0) {
        foreach ($p in $r5.data) {
            $output += "  $($p.name) (active:$($p.active))`n"
            foreach ($s in $p.skus.data) {
                $size = ($s.variations | Where-Object { $_.name -eq "Tamanho" }).value
                $output += "    $size => token:$($s.token) price:$($s.price_discount)`n"
            }
        }
    } else {
        $output += "  No results`n"
    }
} catch {
    $output += "  Error: $($_.Exception.Message)`n"
}

$output | Out-File -FilePath "yampi_search.txt" -Encoding utf8
Write-Host "Done!"
