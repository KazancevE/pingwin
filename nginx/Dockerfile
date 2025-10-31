FROM nginx:alpine

# Обновляем индекс пакетов и устанавливаем certbot в один RUN
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories \
    && apk update \
    && mkdir -p /var/www/certbot /etc/letsencrypt /etc/nginx/ssl
# Копируем nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]