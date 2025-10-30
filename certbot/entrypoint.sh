#!/bin/bash

echo "🔧 Starting Certbot entrypoint..."

crond -f &
CRON_PID=$!

sleep 10

if [ ! -f "/etc/letsencrypt/live/your-school.com/fullchain.pem" ]; then
    echo "📝 Requesting initial SSL certificate..."
    certbot certonly --webroot -w /var/www/certbot \
        -d your-school.com \
        -d www.your-school.com \
        --email admin@your-school.com \
        --agree-tos \
        --noninteractive
    
    if [ -f "/etc/letsencrypt/live/your-school.com/fullchain.pem" ]; then
        cp /etc/letsencrypt/live/your-school.com/fullchain.pem /etc/nginx/ssl/
        cp /etc/letsencrypt/live/your-school.com/privkey.pem /etc/nginx/ssl/
        echo "✅ Initial certificates copied to nginx"
    fi
fi

wait $CRON_PID