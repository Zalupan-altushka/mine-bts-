import express from 'express';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());

const supabaseUrl = 'postgresql://postgres:NXoLbLTGAamZM5c9@db.dzirculfhkoafjraqaih.supabase.co:5432/postgres'; // замените на ваш URL
const supabaseKey = 'NXoLbLTGAamZM5c9';// замените на ваш ключ
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Проверяет наличие пользователя по userId.
 * Если нет — добавляет с начальным количеством очков.
 */
async function ensureUserExists(userId) {
  try {
    const { data, error } = await supabase
      .from('telegram_scores_tg_webApp') // название таблицы
      .select('id')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Запись не найдена — вставляем
        const { error: insertError } = await supabase
          .from('telegram_scores_tg_webApp')
          .insert({ id: userId, points: 0.0333 });
        if (insertError) {
          throw insertError;
        }
      } else {
        // Другие ошибки
        throw error;
      }
    } else if (!data) {
      // Нет данных — вставляем
      const { error: insertError } = await supabase
        .from('telegram_scores_tg_webApp')
        .insert({ id: userId, points: 0.0333 });
      if (insertError) {
        throw insertError;
      }
    }
  } catch (err) {
    console.error('Ошибка при проверке/создании пользователя:', err);
    throw err;
  }
}

app.post('/api/ensure-user', async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }
  try {
    await ensureUserExists(userId);
    res.json({ message: 'Пользователь проверен или добавлен' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.listen(5000, () => {
  console.log('Server listening on port 5000');
});