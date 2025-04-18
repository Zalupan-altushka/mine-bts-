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
app.post('/api/user', (req, res) => {
  const { userId, points } = req.body;

  db.collection('users').findOne({ userId: userId })
    .then(existingUser => {
      if (existingUser) {
        // User exists, update their points
        return db.collection('users').updateOne(
          { userId: userId },
          { $set: { points: existingUser.points + points } } // Increment points
        );
      } else {
        // User does not exist, create a new user
        return db.collection('users').insertOne({
          userId: userId,
          points: points,
          createdAt: new Date()
        });
      }
    })
    .then(result => {
      res.status(200).json({ message: 'User data processed successfully', result });
    })
    .catch(err => {
      console.error('Error processing user data:', err);
      res.status(500).json({ message: 'Error processing user data' });
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