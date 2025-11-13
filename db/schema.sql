-- Таблица категорий (Чай, Кофе, Десерты)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,       
    name_ru TEXT NOT NULL,
    name_en TEXT NOT NULL,
    image_url TEXT
);

-- Таблица позиций меню
CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name_ru TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_ru TEXT,
    description_en TEXT,
    price INT NOT NULL,
    image_url TEXT
);

-- Стартовые категории
INSERT INTO categories (slug, name_ru, name_en, image_url) VALUES
  ('coffee',  'Кофе',    'Coffee',   'https://images.pexels.com/photos/34085/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600'),
  ('tea',     'Чай',     'Tea',      'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('desserts','Десерты', 'Desserts', 'https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=600');

-- Стартовые позиции
INSERT INTO menu_items (category_id, name_ru, name_en, description_ru, description_en, price, image_url) VALUES
  (1, 'Латте', 'Latte',
   'Эспрессо, молоко, молочная пена',
   'Espresso, milk, milk foam',
   220,
   'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600'),

  (1, 'Капучино', 'Cappuccino',
   'Эспрессо, взбитое молоко, пена',
   'Espresso, steamed milk, foam',
   230,
   'https://images.pexels.com/photos/4109991/pexels-photo-4109991.jpeg?auto=compress&cs=tinysrgb&w=600'),

  (2, 'Черный чай', 'Black tea',
   'Классический черный чай',
   'Classic black tea',
   120,
   'https://images.pexels.com/photos/373888/pexels-photo-373888.jpeg?auto=compress&cs=tinysrgb&w=600'),

  (3, 'Чизкейк', 'Cheesecake',
   'Нежный сливочный чизкейк',
   'Soft creamy cheesecake',
   260,
   'https://images.pexels.com/photos/704569/pexels-photo-704569.jpeg?auto=compress&cs=tinysrgb&w=600');
