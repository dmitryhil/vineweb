FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы
COPY . .

# Создаем папку для загрузок
RUN mkdir -p uploads

# Открываем порт
EXPOSE 5000

# Запускаем приложение
CMD ["npm", "start"]