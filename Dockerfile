FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

RUN npm run build

FROM nginx:stable-alpine

RUN mkdir -p /tmp/nginx/client_temp \
    && chmod -R 777 /tmp/nginx
RUN mkdir -p /tmp/nginx /run && chmod -R 777 /tmp /run

COPY --from=build /app/dist /var/www/html

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8880

CMD ["nginx", "-g", "daemon off;"]