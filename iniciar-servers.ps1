# Tyson Styles - Start Servers
# Run both backend and frontend in background

# Start Backend
Write-Host "Starting Backend on port 3001..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\Iris\Proyectos\tyson-styles\backend; node dist/src/main.js" -WindowStyle Hidden -PassThru

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend  
Write-Host "Starting Frontend on port 3000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\Iris\Proyectos\tyson-styles; npm run dev" -WindowStyle Normal -PassThru

Write-Host "`nServers should be running!" -ForegroundColor Green
Write-Host "Store: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Admin: http://localhost:3000/admin-tyson (password: Admin2024)" -ForegroundColor Yellow
Write-Host "API: http://localhost:3001/api" -ForegroundColor Yellow