const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'frontend')));

// --- API получения меню ---
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
    console.error("⚠️ Error in /api/menu:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
