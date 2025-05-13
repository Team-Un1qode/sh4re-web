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

# 기본 nginx 설정 파일을 삭제한다. (custom 설정과 충돌 방지)
RUN rm /etc/nginx/conf.d/default.conf

# custom 설정파일을 컨테이너 내부로 복사한다.
COPY nginx.conf /etc/nginx/nginx.conf

# 컨테이너의 80번 포트를 열어준다.
EXPOSE 8080

# nginx 서버를 실행하고 백그라운드로 동작하도록 한다.
CMD ["nginx", "-g", "daemon off;"]