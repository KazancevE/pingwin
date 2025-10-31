FROM nginx:alpine

# Обновляем индекс пакетов и устанавливаем certbot в один RUN
RUN apk update && \
    # apk add --no-cache certbot-nginx && \
    mkdir -p /var/www/certbot /etc/letsencrypt /etc/nginx/ssl

# Копируем nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]