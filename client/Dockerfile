FROM node:17.5 as builder

WORKDIR /app/

COPY . .

RUN npm install && npm run build

FROM nginx:1.21

COPY --from=builder /app/public/ /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
