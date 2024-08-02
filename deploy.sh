#!/bin/bash

# Параметры
ANGULAR_PROJECT_PATH="/Users/romanveselov/Documents/GitHub/DayGlimpse/frontend"
ANGULAR_BUILD_PATH="$ANGULAR_PROJECT_PATH/dist/client"
DOTNET_PROJECT_PATH="/Users/romanveselov/Documents/GitHub/DayGlimpse/server"
DOTNET_BUILD_PATH="$DOTNET_PROJECT_PATH/bin/Release/net8.0/publish"
REMOTE_SERVER="admin@192.168.118.20"
REMOTE_HTML_PATH="/var/www/html"
REMOTE_SERVER_PATH="/var/www/server"
SERVICE_NAME="server.service"

# Собираем Angular клиент
echo "Building Angular client..."
cd $ANGULAR_PROJECT_PATH
ng build --configuration production

# Собираем .NET сервер
echo "Building .NET server..."
cd $DOTNET_PROJECT_PATH
sudo dotnet publish --configuration Release

# Копируем клиент на удаленный сервер
echo "Copying client files to remote server..."
scp -r $ANGULAR_BUILD_PATH/* $REMOTE_SERVER:$REMOTE_HTML_PATH

# Копируем сервер на удаленный сервер
echo "Copying server files to remote server..."
scp -r $DOTNET_BUILD_PATH/* $REMOTE_SERVER:$REMOTE_SERVER_PATH

# Перезапускаем службу на удаленном сервере
echo "Restarting service on remote server..."
ssh $REMOTE_SERVER "sudo systemctl restart $SERVICE_NAME"

echo "Deployment completed!"
