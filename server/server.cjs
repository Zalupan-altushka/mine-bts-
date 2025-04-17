const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// Обработка POST-запроса для регистрации пользователя
app.post('/api/user', (req, res) => {
  const { userId, points, inviterId } = req.body;

  db.collection('users').updateOne(
    { userId: userId },
    { 
      $set: { points: points }, 
      $setOnInsert: { createdAt: new Date() },
      $inc: { inviteCount: inviterId ? 1 : 0 } // Увеличиваем счетчик приглашений, если inviterId предоставлен
    },
    { upsert: true }
  )
  .then(result => {
    res.status(200).json({ message: 'User data saved successfully', result });
  })
  .catch(err => {
    console.error('Error saving user data:', err);
    res.status(500).json({ message: 'Error saving user data' });
  });
});

// Обработка POST-запроса для регистрации нового пользователя по приглашению
app.post('/api/invite', async (req, res) => {
  const { userId, inviterId } = req.body;

  try {
    const user = await db.collection('users').findOne({ userId: userId });
    if (!user) {
      // Если пользователь не существует, создаем нового
      await db.collection('users').insertOne({ userId: userId, createdAt: new Date(), inviteCount: 0 });
      
      // Увеличиваем счетчик приглашений у пригласившего пользователя, если inviterId предоставлен
      if (inviterId) {
        await db.collection('users').updateOne({ userId: inviterId }, { $inc: { inviteCount: 1 } });
      }

      return res.status(201).json({ message: 'User created and invite count incremented.' });
    } else {
      return res.status(200).json({ message: 'User already exists.' });
    }
  } catch (error) {
    console.error('Error in invite handler:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
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
