# Node.js 이미지를 기반으로 설정
FROM node:14

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 패키지 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 애플리케이션 소스 복사
COPY . .

# 컨테이너가 사용할 포트 설정
EXPOSE 8080

# 애플리케이션 실행
CMD ["node", "server.js"]