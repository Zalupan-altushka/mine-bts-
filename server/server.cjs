const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Подключение к MongoDB
const client = new MongoClient(process.env.MONGODB_URI);
let db;

client.connect()
  .then(() => {
    db = client.db('BTS');
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Завершить процесс, если не удалось подключиться
  });

// Обработка POST-запроса
app.get('/api/user/:userId', (req, res) => {
  const userId = req.params.userId;

  db.collection('users').findOne({ userId: userId })
    .then(user => {
      if (user) {
        res.json({ userId: user.userId, points: user.points });
      } else {
        // Если пользователь не найден, можно вернуть points = 0.0333 или ошибку
        res.json({ userId: userId, points: 0.0333 });
      }
    })
    .catch(err => {
      console.error('Ошибка при получении пользователя:', err);
      res.status(500).json({ message: 'Ошибка сервера' });
    });
});

// Обработчик GET-запроса на корневом маршруте
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// Закрытие подключения к MongoDB при завершении работы сервера
process.on('SIGINT', () => {
  client.close()
    .then(() => {
      console.log('MongoDB connection closed');
      process.exit(0);
    })
    .catch(err => {
      console.error('Error closing MongoDB connection:', err);
      process.exit(1);
    });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});