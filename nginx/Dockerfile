FROM nginx:alpine

# Install certbot
RUN apk add --no-cache certbot

# Create directories
RUN mkdir -p /var/www/certbot && \
    mkdir -p /etc/letsencrypt && \
    mkdir -p /etc/nginx/ssl

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]