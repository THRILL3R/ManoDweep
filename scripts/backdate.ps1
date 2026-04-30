$ErrorActionPreference = "Stop"

$files = git ls-files -m -o --exclude-standard
if ($null -eq $files) {
    Write-Host "No files to commit."
    exit
}
if ($files -is [string]) { $files = @($files) }
$totalFiles = $files.Count

if ($totalFiles -eq 0) {
    Write-Host "No files to commit."
    exit
}

$days = 60
$filesPerDay = [Math]::Ceiling($totalFiles / $days)
Write-Host "Total files: $totalFiles. Files per day: $filesPerDay over $days days."

$index = 0
$currentDate = (Get-Date).AddDays(-$days)

# Set author so commit succeeds seamlessly
git config user.name "Sanket"
git config user.email "sanket.dekaglgt@gmail.com"

for ($i = 1; $i -le $days; $i++) {
    if ($index -ge $totalFiles) { break }
    
    $chunk = $files | Select-Object -Skip $index -First $filesPerDay
    foreach ($file in $chunk) {
        # git outputs paths with forward slashes, which git add handles perfectly.
        # We wrap in quotes just in case there are spaces in the paths.
        git add "`"$file`""
    }
    
    # Standard format Git recognizes easily
    $dateStr = $currentDate.ToString("yyyy-MM-ddTHH:mm:sszzz")
    
    $env:GIT_AUTHOR_DATE = $dateStr
    $env:GIT_COMMITTER_DATE = $dateStr
    
    git commit -m "feat: incremental update (part $i)"
    
    $index += $filesPerDay
    $currentDate = $currentDate.AddDays(1)
}

Remove-Item Env:\GIT_AUTHOR_DATE -ErrorAction SilentlyContinue
Remove-Item Env:\GIT_COMMITTER_DATE -ErrorAction SilentlyContinue

Write-Host "Done! You can now run 'git push'."
