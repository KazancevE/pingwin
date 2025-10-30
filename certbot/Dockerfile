FROM certbot/certbot:latest

RUN apk add --no-cache cronie bash

COPY renew-cron.sh /opt/renew-cron.sh
RUN chmod +x /opt/renew-cron.sh

COPY entrypoint.sh /opt/entrypoint.sh
RUN chmod +x /opt/entrypoint.sh

RUN echo "0 12 * * * /opt/renew-cron.sh >> /var/log/cron.log 2>&1" > /etc/crontabs/root

ENTRYPOINT ["/opt/entrypoint.sh"]