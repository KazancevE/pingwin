#!/bin/bash

echo "$(date): Starting SSL certificate renewal"

certbot renew --quiet --post-hook "nginx -s reload"

if [ -d "/etc/letsencrypt/live/your-school.com" ]; then
    cp /etc/letsencrypt/live/your-school.com/fullchain.pem /etc/nginx/ssl/
    cp /etc/letsencrypt/live/your-school.com/privkey.pem /etc/nginx/ssl/
    echo "$(date): Certificates updated"
else
    echo "$(date): No certificates found for your-school.com"
fi