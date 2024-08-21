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

# Получаем подтверждение от пользователя
echo "Что вы хотите собрать и развернуть?"
echo "1 - Только клиентскую часть"
echo "2 - Только серверную часть"
echo "3 - Обе части"
read -p "Выберите опцию (1/2/3): " user_choice

if [[ "$user_choice" == "1" ]] || [[ "$user_choice" == "3" ]]; then
  # Собираем Angular клиент
  echo "Building Angular client..."
  cd $ANGULAR_PROJECT_PATH
  ng build --configuration production

  # Копируем клиент на удаленный сервер
  echo "Copying client files to remote server..."
  scp -r $ANGULAR_BUILD_PATH/* $REMOTE_SERVER:$REMOTE_HTML_PATH
fi

if [[ "$user_choice" == "2" ]] || [[ "$user_choice" == "3" ]]; then
  # Изменяем права доступа к директориям
  echo "Changing permissions for .NET project directory..."
  sudo chown -R $USER $DOTNET_PROJECT_PATH/obj/Release/net8.0/

  # Собираем .NET сервер
  echo "Building .NET server..."
  cd $DOTNET_PROJECT_PATH
  dotnet clean
  dotnet publish --configuration Release

  # Копируем сервер на удаленный сервер
  echo "Copying server files to remote server..."
  scp -r $DOTNET_BUILD_PATH/* $REMOTE_SERVER:$REMOTE_SERVER_PATH

  # Перезапускаем службу на удаленном сервере
  echo "Restarting service on remote server..."
  ssh $REMOTE_SERVER "sudo systemctl restart $SERVICE_NAME"
fi

echo "Deployment completed!"
