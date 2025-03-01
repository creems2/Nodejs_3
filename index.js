const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'views.json');

// Загружаем данные из файла
const loadData = () => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        }
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
    return { '/': 0, '/about': 0 }; 
};

// Сохраняем данные в файл
const saveData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Ошибка сохранения данных:', error);
    }
};

// Загружаем данные при старте сервера
let views = loadData();

// счетчик просмотров
const updateCounter = (req, res, next) => {
    const page = req.path;
    views[page] = (views[page] || 0) + 1;
    saveData(views);
    next();
};

// Обработчик главной страницы
app.get('/', updateCounter, (req, res) => {
    res.send(`
        <h1>Главная страница</h1>
        <p>Просмотров: ${views['/']}</p>
        <a href="/about">Перейти на страницу "О нас"</a>
    `);
});

// Обработчик страницы "О нас"
app.get('/about', updateCounter, (req, res) => {
    res.send(`
        <h1>О нас</h1>
        <p>Просмотров: ${views['/about']}</p>
        <a href="/">Перейти на главную</a>
    `);
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});