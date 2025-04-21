import express from 'express';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());

const supabaseUrl = 'https://<your-supabase-project>.supabase.co'; // замените на ваш URL
const supabaseKey = '<your-anon-key>'; // замените на ваш ключ
const supabase = createClient(supabaseUrl, supabaseKey);

// API для автоматического добавления пользователя (при первом обращении)
app.post('/api/ensure-user', async (req, res) => {
  const { userId } = req.body;
  try {
    await supabase
      .from('telegram_scores_tg_webApp')
      .upsert({ id: userId, points: 0.0333 });
    res.json({ message: 'Пользователь добавлен или уже существует' });
  } catch (err) {
    console.error('Ошибка при добавлении пользователя:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// API для получения очков
app.get('/api/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const { data, error } = await supabase
      .from('telegram_scores_tg_webApp')
      .select('points')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Пользователь не найден, создаем его
        await supabase
          .from('telegram_scores_tg_webApp')
          .insert({ id: userId, points: 0.0333 });
        return res.json({ points: 0.0333 });
      }
      throw error;
    }
    res.json({ points: data.points });
  } catch (err) {
    console.error('Ошибка при получении очков:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// API для обновления очков
app.post('/api/user/:userId/update-points', async (req, res) => {
  const { userId } = req.params;
  const { points } = req.body;

  if (points === undefined) {
    return res.status(400).json({ error: 'points are required' });
  }

  try {
    await supabase
      .from('telegram_scores_tg_webApp')
      .update({ points })
      .eq('id', userId);
    res.json({ message: 'Очки обновлены' });
  } catch (err) {
    console.error('Ошибка при обновлении очков:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.listen(5000, () => {
  console.log('Server listening on port 5000');
});

