
FROM nginx:alpine
RUN mkdir -p /var/www/certbot /etc/letsencrypt /etc/nginx/ssl
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]