$ErrorActionPreference = "Stop"

$files = git ls-files -m -o --exclude-standard
if ($null -eq $files) {
    Write-Host "No files to commit."
    exit
}
if ($files -is [string]) { $files = @($files) }
$totalFiles = $files.Count
$days = 60

if ($totalFiles -lt $days) {
    Write-Host "Not enough files to cover $days days."
    exit
}

$whiteDaysCount = Get-Random -Minimum 4 -Maximum 6
$whiteDays = @()
while ($whiteDays.Count -lt $whiteDaysCount) {
    $r = Get-Random -Minimum 0 -Maximum $days
    if ($whiteDays -notcontains $r) { $whiteDays += $r }
}

Write-Host "Adding $whiteDaysCount white days..."

[int[]]$dayCommitCounts = New-Object int[] $days
for ($i = 0; $i -lt $days; $i++) {
    if ($whiteDays -contains $i) {
        $dayCommitCounts[$i] = 0
    } else {
        $dayCommitCounts[$i] = 1
    }
}

$remaining = $totalFiles - ($days - $whiteDaysCount)
for ($i = 0; $i -lt $remaining; $i++) {
    $r = Get-Random -Minimum 0 -Maximum $days
    while ($whiteDays -contains $r) {
        $r = Get-Random -Minimum 0 -Maximum $days
    }
    $dayCommitCounts[$r]++
}

$index = 0
$baseDate = (Get-Date).AddDays(-$days)

git config user.name "Sanket"
git config user.email "sanket.dekaglgt@gmail.com"

for ($d = 0; $d -lt $days; $d++) {
    $count = $dayCommitCounts[$d]
    if ($count -eq 0) { continue }
    
    $currentDate = $baseDate.AddDays($d)
    
    for ($c = 0; $c -lt $count; $c++) {
        if ($index -ge $totalFiles) { break }
        
        $file = $files[$index]
        git add "`"$file`""
        
        $commitTime = $currentDate.AddHours($c)
        $dateStr = $commitTime.ToString("yyyy-MM-ddTHH:mm:sszzz")
        
        $env:GIT_AUTHOR_DATE = $dateStr
        $env:GIT_COMMITTER_DATE = $dateStr
        
        git commit -m "feat: adding component $index"
        
        $index++
    }
}

Remove-Item Env:\GIT_AUTHOR_DATE -ErrorAction SilentlyContinue
Remove-Item Env:\GIT_COMMITTER_DATE -ErrorAction SilentlyContinue

Write-Host "Done randomizing commits with white days!"
