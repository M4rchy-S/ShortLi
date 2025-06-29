FROM node:22 AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build


FROM nginx:1.25-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"] 