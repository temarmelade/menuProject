const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// раздаём фронтенд
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ================== API ДЛЯ ПОЛЬЗОВАТЕЛЯ (МЕНЮ) ==================
app.get('/api/menu', async (req, res) => {
  const lang = req.query.lang === 'en' ? 'en' : 'ru';

  try {
    const client = await pool.connect();

    const categoriesResult = await client.query(
        `SELECT id, slug, name_${lang} AS name, image_url
       FROM categories
       ORDER BY id;`
    );

    const itemsResult = await client.query(
        `SELECT id, category_id, name_${lang} AS name,
              description_${lang} AS description,
              price, image_url
       FROM menu_items
       ORDER BY id;`
    );

    client.release();

    const itemsByCategory = {};
    for (const item of itemsResult.rows) {
      if (!itemsByCategory[item.category_id]) {
        itemsByCategory[item.category_id] = [];
      }
      itemsByCategory[item.category_id].push(item);
    }

    const menu = categoriesResult.rows.map(cat => ({
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      imageUrl: cat.image_url,
      items: itemsByCategory[cat.id] || [],
    }));

    res.json(menu);

  } catch (err) {
    console.error('⚠️ Error in /api/menu:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ================== ADMIN API: КАТЕГОРИИ ==================

// (опционально) получить список категорий
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query(
        'SELECT id, slug, name_ru, name_en, image_url FROM categories ORDER BY id;'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error in GET /api/categories:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// добавить категорию
app.post('/api/categories', async (req, res) => {
  const { slug, name_ru, name_en, image_url } = req.body;

  if (!slug || !name_ru || !name_en) {
    return res.status(400).json({ error: 'slug, name_ru и name_en обязательны' });
  }

  try {
    const result = await pool.query(
        `INSERT INTO categories (slug, name_ru, name_en, image_url)
       VALUES ($1, $2, $3, $4)
       RETURNING id, slug, name_ru, name_en, image_url;`,
        [slug, name_ru, name_en, image_url || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error in POST /api/categories:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// удалить категорию (из-за ON DELETE CASCADE удалятся и её позиции)
app.delete('/api/categories/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await pool.query('DELETE FROM categories WHERE id = $1;', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error in DELETE /api/categories/:id:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ================== ADMIN API: ПОЗИЦИИ ==================

// добавить позицию
app.post('/api/items', async (req, res) => {
  const {
    category_id,
    name_ru,
    name_en,
    description_ru,
    description_en,
    price,
    image_url,
  } = req.body;

  if (!category_id || !name_ru || !name_en || !price) {
    return res.status(400).json({ error: 'category_id, name_ru, name_en, price обязательны' });
  }

  try {
    const result = await pool.query(
        `INSERT INTO menu_items
         (category_id, name_ru, name_en, description_ru, description_en, price, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, category_id, name_ru, name_en, description_ru, description_en, price, image_url;`,
        [
          category_id,
          name_ru,
          name_en,
          description_ru || null,
          description_en || null,
          price,
          image_url || null,
        ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error in POST /api/items:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// удалить позицию
app.delete('/api/items/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await pool.query('DELETE FROM menu_items WHERE id = $1;', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error in DELETE /api/items/:id:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ================== ЗАПУСК СЕРВЕРА ==================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
