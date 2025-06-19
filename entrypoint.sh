#!/bin/sh
# entrypoint.sh

# 스크립트 실행 중 오류가 발생하면 즉시 중단
set -e

# /usr/share/nginx/html/env.js 파일 경로 (Nginx 기본 경로)
ENV_JS_FILE=/var/www/html/env.js

# docker-compose.yml에서 전달받을 환경 변수를 읽어옴
# 만약 VITE_BACKEND_URL 변수가 없다면 빈 문자열로 설정
export VITE_BACKEND_URL=${VITE_BACKEND_URL}

# env.js 파일에 있는 '__VITE_BACKEND_URL__' 문자열을
# 실제 VITE_BACKEND_URL 환경 변수 값으로 치환(replace)
sed -i "s|__VITE_BACKEND_URL__|${VITE_BACKEND_URL}|g" $ENV_JS_FILE

# 스크립트의 원래 목적인 Nginx 서버를 실행
exec "$@"