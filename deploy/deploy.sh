#!/bin/bash
# Production Deployment Automation Script for Ubuntu / Debian VPS
set -e

echo "🥋 Deploying Warrior Martial Arts Academy..."

# Update packages
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3-pip python3-venv nginx postgresql postgresql-contrib curl

# Setup Directory
APP_DIR="/var/www/martial-arts"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Copy code into $APP_DIR or git pull here

# Backend Setup
cd $APP_DIR/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
python seed_data.py

# Frontend Setup
cd $APP_DIR/frontend
npm install
npm run build

# Setup Gunicorn Service
sudo cp $APP_DIR/deploy/gunicorn.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl start gunicorn
sudo systemctl enable gunicorn

# Setup Nginx
sudo cp $APP_DIR/deploy/nginx.conf /etc/nginx/sites-available/martial_arts
sudo ln -sf /etc/nginx/sites-available/martial_arts /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

echo "✨ Deployment complete! Your Martial Arts Academy is live."
