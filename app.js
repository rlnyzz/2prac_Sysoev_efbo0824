const express = require('express');
const app = express();
const port = 3000;
app.get('/'
, (req, res) => {
res.send('Hello, world!');
});
// Middleware для парсинга JSON
app.use(express.json());
// Middleware для парсинга данных форм
app.use(express.urlencoded({ extended: false }));
// Middleware для статических файлов
app.use(express.static('public'));
// Собственное middleware
app.use((req, res, next) => {
// Выводим в консоль метод и путь запроса
console.log(`${req.method} ${req.url}`);
next();
});
// Маршруты
app.get('/'
, (req, res) => {
res.send('Главная страница');
});
app.listen(port, () => {
console.log(`Сервер запущен на http://localhost:${port}`);
});