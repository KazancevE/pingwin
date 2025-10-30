#!/bin/bash

echo "🚀 Starting SSL initialization..."

# Create necessary directories
mkdir -p nginx/ssl
mkdir -p certbot

# Stop any running containers
docker-compose down

# Start nginx for initial certificate
echo "📦 Starting nginx for certificate validation..."
docker-compose up -d nginx

# Wait for nginx to start
sleep 10

# Get initial SSL certificate
echo "🔐 Requesting SSL certificate..."
docker-compose run --rm certbot certonly --webroot -w /var/www/certbot \
    -d your-school.com \
    -d www.your-school.com \
    --email admin@your-school.com \
    --agree-tos \
    --noninteractive

# Stop everything
echo "🛑 Stopping services..."
docker-compose down

# Start all services
echo "🎉 Starting all services with SSL..."
docker-compose up -d

echo "✅ SSL setup complete!"
echo "📱 Check your bot at: https://your-school.com"
echo "🔧 Don't forget to update DOMAIN in .env file!"