# Build step - like preparing the food
FROM node:18 as chef
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
COPY public ./public
RUN npm install
RUN npm run build

# Serving step - like packing the lunchbox
FROM nginx:alpine
COPY --from=chef /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80