# Используем Node.js для сборки приложения
FROM node:18 as build

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package.json ./
RUN npm install

# Копируем остальные файлы и собираем проект
COPY . .
RUN npm run build

# Создаем финальный образ
FROM nginx:alpine

# Копируем собранный проект в директорию Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Открываем порт для клиента
EXPOSE 80

# Запуск Nginx (используем дефолтное поведение)
CMD ["nginx", "-g", "daemon off;"]
