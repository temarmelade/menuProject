CREATE TABLE IF NOT EXISTS categories (
                                          id SERIAL PRIMARY KEY,
                                          slug TEXT UNIQUE NOT NULL,
                                          name_ru TEXT NOT NULL,
                                          name_en TEXT NOT NULL,
                                          image_url TEXT
);

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

TRUNCATE TABLE menu_items RESTART IDENTITY CASCADE;
TRUNCATE TABLE categories RESTART IDENTITY CASCADE;

INSERT INTO categories (slug, name_ru, name_en, image_url) VALUES
                                                               ('coffee',  'Кофе',    'Coffee',   'https://insanelygoodrecipes.com/wp-content/uploads/2020/07/Cup-Of-Creamy-Coffee.png'),
                                                               ('tea',     'Чай',     'Tea',      'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=600'),
                                                               ('desserts','Десерты', 'Desserts', 'https://www.allrecipes.com/thmb/p4f6RaeEnKTJyE4PVm9dzyMKUMc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-636266048-2000-4fe716c6d4584ec4b6ccab88125d4cef.jpg');

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
                                                                                                              'https://www.nescafe.kz/sites/default/files/2024-09/GettyImages-1466623971.jpg'),

                                                                                                             (1, 'Американо', 'Americano',
                                                                                                              'Эспрессо, горячая вода',
                                                                                                              'Espresso, hot water',
                                                                                                              180,
                                                                                                              'https://coffe-spb.ru/img/cms/americano.jpg'),
(2, 'Черный чай', 'Black tea',
                                                                                                              'Классический черный чай',
                                                                                                              'Classic black tea',
                                                                                                              70,
                                                                                                              'https://tea.ru/upload/blog/0920/14/1.jpg'),

                                                                                                             (2, 'Ягодный чай', 'Berry tea',
                                                                                                              'Черный чай, ягоды',
                                                                                                              'Black tea, berries',
                                                                                                              120,
                                                                                                              'https://img.championat.com/i/b/t/1713286326630014106.jpg'),

                                                                                                             (2, 'Облепиховый чай', 'Sea ​​buckthorn tea',
                                                                                                              'Черный чай, облепиха',
                                                                                                              'Black tea, sea ​​​​buckthorn',
                                                                                                              130,
                                                                                                              'https://kavachay.by/upload/iblock/blog-image/oblepihoviy-chay/oblepihoviy-chay.jpg'),

                                                                                                             (3, 'Чизкейк', 'Cheesecake',
                                                                                                              'Нежный сливочный чизкейк',
                                                                                                              'Soft creamy cheesecake',
                                                                                                              160,
                                                                                                              'https://www.onceuponachef.com/images/2017/12/cheesecake.jpg'),

                                                                                                             (3, 'Три шоколада', 'Three chocolates cake',
                                                                                                              'Шоколадный бисквит, шоколадный мусс из белого шоколада, шоколадный мусс из темного шоколада',
                                                                                                              'Chocolate sponge cake, white chocolate mousse, dark chocolate mousse',
                                                                                                              220,
                                                                                                              'https://i.ytimg.com/vi/QtS9SG4T5EY/maxresdefault.jpg'),
                                                                                                              (3, 'Красный бархат', 'Red velvet cake',
                                                                                                              'Вкусный красный бархат',
                                                                                                              'Delicious red velvet cake',
                                                                                                              180,
                                                                                                              'https://pteat.ru/wp-content/uploads/2024/02/mg_3792-803x535.jpg');