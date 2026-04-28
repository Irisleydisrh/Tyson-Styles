# tyson-styles Git Setup & Push
$ErrorActionPreference = "Stop"
$projectDir = "D:\Iris\Proyectos\tyson-styles"

Write-Host "=== Git Setup ===" -ForegroundColor Cyan

# Initialize git
Write-Host "1. Initializing git..."
Set-Location $projectDir
git init
git add .gitignore
git commit -m "chore: initial commit"

# Add all files
Write-Host "2. Adding all files..."
git add -A

# Commit all files
Write-Host "3. Committing..."
$commitMsg = "feat: complete tyson-styles e-commerce project`n- Frontend: TanStack Start + React + TypeScript`n- Backend: NestJS + PostgreSQL`n- UI: Radix UI + Tailwind CSS"
git commit -m $commitMsg

# Add remote
Write-Host "4. Adding remote..."
git remote add origin https://github.com/Irisleydisrh/tyson-styles.git

# Push
Write-Host "5. Pushing to GitHub..."
git branch -M main
git push -u origin main

Write-Host "`n=== SUCCESS! ===" -ForegroundColor Green
Write-Host "Repo: https://github.com/Irisleydisrh/tyson-styles"