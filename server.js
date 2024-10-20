const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 8080;

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const DATA_FILE = './access/data.json';

const readData = () => {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

app.post('/register', (req, res) => {
    const { firstName, email, password, lastName } = req.body;

    if (!firstName || !email || !password || !lastName) {
        return res.status(400).json({ message: 'Все поля обязательны' });
    }

    const data = readData();
    const existingUser = data.users.find(user => user.email === email);

    if (existingUser) {
        return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    const newUser = { firstName, email, password, lastName };
    data.users.push(newUser);
    writeData(data);

    res.status(201).json({ message: 'Пользователь зарегистрирован' });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email и пароль обязательны' });
    }

    const data = readData();
    const user = data.users.find(user => user.email === email && user.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Неверные email или пароль' });
    }

    res.status(200).json({ message: 'Успешный вход', user });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
