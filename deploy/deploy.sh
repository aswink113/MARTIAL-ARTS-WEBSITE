#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/martial-arts}"
cd "$APP_DIR"

git pull --ff-only
.venv/bin/pip install -r requirements.txt
(cd frontend && npm ci && npm run build)
.venv/bin/python manage.py migrate --noinput
.venv/bin/python manage.py collectstatic --noinput
sudo systemctl restart greentrack-martial-arts
sudo nginx -t
sudo systemctl reload nginx
