#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/home/ubuntu/kreator-wymowek"
APP_NAME="kreator-wymowek"

cd "$APP_DIR"

echo "[deploy] pulling..."
git pull --rebase

echo "[deploy] install deps..."
npm install

echo "[deploy] build..."
npm run build

echo "[deploy] restart pm2..."
pm2 restart "$APP_NAME" --update-env || pm2 start ecosystem.config.js --name "$APP_NAME"
pm2 save

echo "[deploy] done"
