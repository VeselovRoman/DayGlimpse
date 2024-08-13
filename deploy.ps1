# Параметры
$ANGULAR_PROJECT_PATH = "D:/GitHub/DayGlimpse/frontend"
$ANGULAR_BUILD_PATH = "$ANGULAR_PROJECT_PATH/dist/client"
$DOTNET_PROJECT_PATH = "D:/GitHub/DayGlimpse/server"
$DOTNET_BUILD_PATH = "$DOTNET_PROJECT_PATH/bin/Release/net8.0/publish"
$REMOTE_SERVER = "admin@192.168.118.20"
$REMOTE_HTML_PATH = "/var/www/html"
$REMOTE_SERVER_PATH = "/var/www/server"
$SERVICE_NAME = "server.service"

# Компиляция Angular проекта
Write-Host "Building Angular client..."
cd $ANGULAR_PROJECT_PATH
npm run build -- --configuration production

# Компиляция .NET проекта
Write-Host "Building .NET server..."
cd $DOTNET_PROJECT_PATH
dotnet clean
dotnet publish --configuration Release

# Копирование файлов Angular на удаленный сервер
Write-Host "Copying client files to remote server..."
scp -r "${ANGULAR_BUILD_PATH}/*" "${REMOTE_SERVER}:${REMOTE_HTML_PATH}"

# Копирование файлов .NET на удаленный сервер
Write-Host "Copying server files to remote server..."
scp -r "${DOTNET_BUILD_PATH}/*" "${REMOTE_SERVER}:${REMOTE_SERVER_PATH}"

# Перезапуск службы на удаленном сервере
Write-Host "Restarting service on remote server..."
ssh $REMOTE_SERVER "sudo systemctl restart $SERVICE_NAME"

Write-Host "Deployment completed!"
