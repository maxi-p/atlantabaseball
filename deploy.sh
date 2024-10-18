#!/bin/bash

APP_NAME="atlanta"
ENTRY_POINT="server.js"
FRONTEND_DIR="frontend" 

cd /home/ec2-user/your-express-app || exit
git pull origin main
npm install

pm2 stop $APP_NAME
pm2 start $ENTRY_POINT --name "$APP_NAME"

cd "$FRONTEND_DIR" || exit
npm install
npm run build
cd ..
