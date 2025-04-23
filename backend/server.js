const express = require('express');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(cookieParser());

// Ваш Telegram Bot Token
const TELEGRAM_BOT_TOKEN = '7973861940:AAGRO6mSHoc5F6CYGp83z89EFAPJPUT6Vzg'; // <-- вставьте сюда ваш токен

// Временное хранилище токенов (для демонстрации)
const userTokens = {}; // userId: token

// Генерация случайного токена
const generateToken = () => Math.random().toString(36).substring(2);

// Функция для получения SHA-256 хеша
const sha256 = (data) => crypto.createHash('sha256').update(data).digest();

// Функция для расшифровки initData
function decryptInitData(initData, secret) {
  // initData — это base64 строка
  const dataBuffer = Buffer.from(initData, 'base64');

  // В Telegram Web Apps, структура данных:
  // [16 байт nonce][ciphertext][16 байт authTag]
  const nonce = dataBuffer.subarray(0, 12); // 12 байт nonce
  const authTag = dataBuffer.subarray(dataBuffer.length - 16); // 16 байт authTag
  const ciphertext = dataBuffer.subarray(12, dataBuffer.length - 16);

  const key = sha256(secret); // ключ из секретного слова

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

  return JSON.parse(decrypted.toString());
}

// Маршрут для обработки initData
app.post('/api/auth/signin', async (req, res) => {
  const { initData } = req.body;

  if (!initData) {
    return res.status(400).json({ success: false, message: 'initData required' });
  }

  try {
    // Расшифровка initData
    const initDataObj = decryptInitData(initData, TELEGRAM_BOT_TOKEN);
    const { user, auth_date } = initDataObj;

    if (!user || !user.id) {
      return res.status(400).json({ success: false, message: 'Invalid initData' });
    }

    const userId = user.id.toString();

    // Можно добавить проверки, например, по auth_date
    // Например, убедиться, что auth_date не слишком старое

    // Генерируем токен
    const token = generateToken();
    userTokens[userId] = token;

    // Устанавливаем токен в cookie
    res.cookie('auth_token', token, { httpOnly: true, secure: false, sameSite: 'Strict' }); // Для разработки secure: false
    return res.json({ success: true });
  } catch (err) {
    console.error('Ошибка decrypt initData:', err);
    return res.status(500).json({ success: false, message: 'Failed to decrypt initData' });
  }
});

// Middleware для проверки авторизации по токену
const authenticateToken = (req, res, next) => {
  const token = req.cookies['auth_token'];
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  const userId = Object.keys(userTokens).find(id => userTokens[id] === token);
  if (!userId) return res.status(401).json({ message: 'Invalid token' });

  req.userId = userId;
  next();
};

// Защищённый маршрут
app.get('/api/auth/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Authorized access', userId: req.userId });
});

// Запуск сервера
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
