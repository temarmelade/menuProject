const app = document.getElementById("app");

const state = {
    role: null,                // 'user' | 'admin' | null
    lang: null,                // 'ru' | 'en'
    menuData: [],              // [{ id, name, imageUrl, items: [...] }]
    currentCategoryId: null,
    view: 'role',              // 'role' | 'language' | 'categories' | 'items' | 'admin'
};

// =============== ГЛАВНЫЙ РЕНДЕР ===============
function render() {
    if (!state.role || state.view === 'role') {
        renderRoleScreen();
        return;
    }

    if (state.role === 'user') {
        if (!state.lang || state.view === 'language') {
            renderLanguageScreen();
        } else {
            renderMenuScreen();
        }
        return;
    }

    if (state.role === 'admin') {
        renderAdminScreen();
    }
}

// =============== ВЫБОР РОЛИ ===============
function renderRoleScreen() {
    state.view = 'role';

    app.innerHTML = `
    <div class="language-screen">
      <div class="brand">
        <div class="brand-logo">☕️</div>
        <div class="brand-text">
          <div class="brand-title">T&E Coffee</div>
        </div>
      </div>

      <div class="title">Кто вы?</div>
      <div class="buttons">
        <button class="button" onclick="setRole('user')">Я клиент</button>
        <button class="button secondary" onclick="setRole('admin')">Я админ</button>
      </div>
    </div>
  `;
}

function setRole(role) {
    state.role = role;

    if (role === 'user') {
        state.lang = null;
        state.view = 'language';
        state.currentCategoryId = null;
        render();
    } else if (role === 'admin') {
        state.lang = 'ru';         // админка по умолчанию в RU
        state.view = 'admin';
        loadMenu('ru', { forAdmin: true });
    }
}

function backToRole() {
    state.role = null;
    state.lang = null;
    state.menuData = [];
    state.currentCategoryId = null;
    state.view = 'role';
    render();
}

// =============== ЗАГРУЗКА МЕНЮ С БЭКА ===============
async function loadMenu(lang, options = {}) {
    state.lang = lang;

    try {
        const res = await fetch(`/api/menu?lang=${lang}`);
        state.menuData = await res.json();

        if (!state.currentCategoryId && state.menuData.length > 0) {
            state.currentCategoryId = state.menuData[0].id;
        }

        if (state.role === 'admin' || options.forAdmin) {
            state.view = 'admin';
            renderAdminScreen();
        } else {
            state.view = 'categories';
            render();
        }
    } catch (e) {
        console.error("Ошибка загрузки меню:", e);
        app.innerHTML = "<p>Ошибка загрузки меню. Попробуйте позже.</p>";
    }
}

// =============== ЭКРАН ВЫБОРА ЯЗЫКА (КЛИЕНТ) ===============
function renderLanguageScreen() {
    state.view = 'language';

    app.innerHTML = `
    <div class="language-screen">
      <div class="brand">
        <div class="brand-logo">☕️</div>
        <div class="brand-text">
          <div class="brand-title">T&E Coffee</div>
        </div>
      </div>

      <div class="title">Выберите язык / Choose language</div>
      <div class="buttons">
        <button class="button" onclick="loadMenu('ru')">Русский</button>
        <button class="button secondary" onclick="loadMenu('en')">English</button>
      </div>

      <div style="margin-top: 16px;">
        <button class="button secondary" onclick="backToRole()">← Назад к выбору роли</button>
      </div>
    </div>
  `;
}

// =============== МЕНЮ ДЛЯ ПОЛЬЗОВАТЕЛЯ ===============
function renderMenuScreen() {
    const categories = state.menuData;

    if (!categories || categories.length === 0) {
        app.innerHTML = `
      <div class="screen">
        <p>Меню пустое.</p>
        <button class="button secondary" onclick="backToRole()">← Назад</button>
      </div>
    `;
        return;
    }

    const activeCategory =
        categories.find(c => c.id === state.currentCategoryId) || categories[0];

    const isItemsView = state.view === 'items';

    app.innerHTML = `
    <div class="screen">
      <div class="header">
        <div class="brand">
          <div class="brand-logo">☕️</div>
          <div class="brand-text">
            <div class="brand-title">T&E Coffee</div>
          </div>
        </div>

        <div>
          <div class="lang-switch">
            <button class="lang-btn ${state.lang === 'ru' ? 'active' : ''}" onclick="changeLanguage('ru')">RU</button>
            <button class="lang-btn ${state.lang === 'en' ? 'active' : ''}" onclick="changeLanguage('en')">EN</button>
          </div>
          <button class="lang-btn" style="margin-top: 6px;" onclick="backToRole()">← Роль</button>
        </div>
      </div>

      <div class="menu-header">
        <h1>${state.lang === 'ru' ? 'Меню' : 'Menu'}</h1>
        <p>
          ${
        state.view === 'categories'
            ? (state.lang === 'ru'
                ? 'Выберите категорию, чтобы посмотреть позиции.'
                : 'Choose a category to see the items.')
            : (state.lang === 'ru'
                ? 'Выберите категорию или вернитесь ко всем категориям.'
                : 'Choose a category or go back to all categories.')
    }
        </p>
      </div>

      ${
        isItemsView
            ? `
          <div class="menu-top-row">
            <button class="back-btn" onclick="showCategoriesView()">
              ${state.lang === 'ru' ? '← Все категории' : '← All categories'}
            </button>
            <div class="category-tabs">
              ${categories
                .map(
                    cat => `
                <button
                  class="category-tab ${cat.id === activeCategory.id ? 'active' : ''}"
                  onclick="selectCategory(${cat.id})"
                >
                  ${cat.name}
                </button>
              `
                )
                .join('')}
            </div>
          </div>

          <div class="items-grid">
            ${activeCategory.items
                .map(
                    item => `
              <div class="item-card">
                <div class="item-image-wrapper">
                  <img src="${item.image_url || item.imageUrl}" alt="${item.name}" loading="lazy" />
                </div>
                <div class="item-body">
                  <div class="item-title-row">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">${item.price} ${
                        state.lang === 'ru' ? 'сом' : 'KGS'
                    }</div>
                  </div>
                  <div class="item-desc">${item.description || ''}</div>
                </div>
              </div>
            `
                )
                .join('')}
          </div>
        `
            : `
          <div class="categories-grid">
            ${categories
                .map(
                    cat => `
              <div class="category-card" onclick="openCategory(${cat.id})">
                <div class="category-image-wrapper">
                  <img src="${cat.image_url || cat.imageUrl}" alt="${cat.name}" loading="lazy" />
                </div>
                <div class="category-body">
                  <div class="category-name">${cat.name}</div>
                </div>
              </div>
            `
                )
                .join('')}
          </div>
        `
    }
    </div>
  `;
}

function openCategory(id) {
    state.currentCategoryId = id;
    state.view = 'items';
    render();
}

function showCategoriesView() {
    state.view = 'categories';
    render();
}

function selectCategory(id) {
    state.currentCategoryId = id;
    state.view = 'items';
    render();
}

function changeLanguage(lang) {
    if (lang === state.lang) return;
    loadMenu(lang);
}

// =============== АДМИН-ПАНЕЛЬ ===============
async function renderAdminScreen() {
    state.view = 'admin';

    // если меню ещё не загружено – загрузим и снова вызовем этот экран
    if (!state.menuData || state.menuData.length === 0) {
        await loadMenu('ru', { forAdmin: true });
        return;
    }

    const categories = state.menuData;

    app.innerHTML = `
    <div class="screen">
      <div class="header">
        <div class="brand">
          <div class="brand-logo">⚙️</div>
          <div class="brand-text">
            <div class="brand-title">Admin panel</div>
            <div class="brand-subtitle">управление меню</div>
          </div>
        </div>

        <button class="lang-btn" onclick="backToRole()">← Выйти</button>
      </div>

      <div class="menu-header">
        <h1>Категории</h1>
        <p>Добавляйте и удаляйте категории. При удалении категории удаляются все её позиции.</p>
      </div>

      <!-- Форма добавления категории -->
      <div style="background:#fff; border-radius:12px; padding:12px; margin-bottom:16px; box-shadow:0 6px 12px rgba(15,23,42,0.12);">
        <h2 style="font-size:16px; margin-bottom:8px;">Добавить категорию</h2>
        <div style="display:grid; grid-template-columns: repeat(auto-fit,minmax(140px,1fr)); gap:8px;">
          <input id="cat-slug" placeholder="slug (напр. coffee)" />
          <input id="cat-name-ru" placeholder="Название RU (Кофе)" />
          <input id="cat-name-en" placeholder="Название EN (Coffee)" />
          <input id="cat-image-url" placeholder="URL картинки категории" />
        </div>
        <button class="button" style="margin-top:10px;" onclick="handleAddCategory()">Добавить категорию</button>
      </div>

      <!-- Список категорий -->
      <div style="background:#fff; border-radius:12px; padding:12px; box-shadow:0 6px 12px rgba(15,23,42,0.12); margin-bottom:24px;">
        <h2 style="font-size:16px; margin-bottom:8px;">Список категорий</h2>
        ${
        categories.length === 0
            ? '<p>Категорий нет.</p>'
            : `
              <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:6px;">
                ${categories
                .map(
                    cat => `
                  <li style="display:flex; justify-content:space-between; align-items:center; font-size:14px;">
                    <span>#${cat.id} — ${cat.name} (${cat.slug})</span>
                    <button class="lang-btn" onclick="handleDeleteCategory(${cat.id})">Удалить</button>
                  </li>
                `
                )
                .join('')}
              </ul>
            `
    }
      </div>

      <!-- Блок позиций -->
      <div class="menu-header">
        <h1>Позиции</h1>
        <p>Добавляйте и удаляйте блюда/напитки.</p>
      </div>

      <div style="background:#fff; border-radius:12px; padding:12px; box-shadow:0 6px 12px rgba(15,23,42,0.12);">
        <h2 style="font-size:16px; margin-bottom:8px;">Добавить позицию</h2>
        <div style="display:grid; grid-template-columns: repeat(auto-fit,minmax(160px,1fr)); gap:8px;">
          <input id="item-category-id" placeholder="ID категории (число)" />
          <input id="item-name-ru" placeholder="Название RU" />
          <input id="item-name-en" placeholder="Название EN" />
          <input id="item-desc-ru" placeholder="Описание RU" />
          <input id="item-desc-en" placeholder="Описание EN" />
          <input id="item-price" placeholder="Цена (число)" />
          <input id="item-image-url" placeholder="URL картинки позиции" />
        </div>
        <button class="button" style="margin-top:10px;" onclick="handleAddItem()">Добавить позицию</button>
      </div>

      <!-- Список позиций (кратко по категориям) -->
      <div style="margin-top:16px;">
        <h2 style="font-size:16px; margin-bottom:8px;">Все позиции (кратко)</h2>
        ${
        categories
            .map(cat => {
                if (!cat.items || cat.items.length === 0) return '';
                return `
                <div style="margin-bottom:8px; background:#fff; border-radius:10px; padding:8px; box-shadow:0 4px 8px rgba(15,23,42,0.08);">
                  <div style="font-weight:600; font-size:14px; margin-bottom:4px;">${cat.name} (#${cat.id})</div>
                  <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:4px; max-height:180px; overflow-y:auto;">
                    ${cat.items
                    .map(
                        item => `
                      <li style="display:flex; justify-content:space-between; font-size:13px;">
                        <span>#${item.id} — ${item.name} (${item.price} сом)</span>
                        <button class="lang-btn" onclick="handleDeleteItem(${item.id})">Удалить</button>
                      </li>
                    `
                    )
                    .join('')}
                  </ul>
                </div>
              `;
            })
            .join('') || '<p>Пока нет позиций.</p>'
    }
      </div>
    </div>
  `;
}

// =============== АДМИН: ОБРАБОТЧИКИ ===============
async function handleAddCategory() {
    const slug = document.getElementById('cat-slug').value.trim();
    const name_ru = document.getElementById('cat-name-ru').value.trim();
    const name_en = document.getElementById('cat-name-en').value.trim();
    const image_url = document.getElementById('cat-image-url').value.trim();

    if (!slug || !name_ru || !name_en) {
        alert('Заполните slug, название RU и EN');
        return;
    }

    try {
        const res = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug, name_ru, name_en, image_url }),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            alert('Ошибка при добавлении категории: ' + (data.error || res.status));
            return;
        }

        await loadMenu('ru', { forAdmin: true });

        document.getElementById('cat-slug').value = '';
        document.getElementById('cat-name-ru').value = '';
        document.getElementById('cat-name-en').value = '';
        document.getElementById('cat-image-url').value = '';
    } catch (e) {
        console.error('handleAddCategory error:', e);
        alert('Ошибка сети при добавлении категории');
    }
}

async function handleDeleteCategory(id) {
    if (!confirm('Удалить категорию и все её позиции?')) return;

    try {
        const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            alert('Ошибка при удалении категории');
            return;
        }
        await loadMenu('ru', { forAdmin: true });
    } catch (e) {
        console.error('handleDeleteCategory error:', e);
        alert('Ошибка сети при удалении категории');
    }
}

async function handleAddItem() {
    const category_id = Number(document.getElementById('item-category-id').value.trim());
    const name_ru = document.getElementById('item-name-ru').value.trim();
    const name_en = document.getElementById('item-name-en').value.trim();
    const description_ru = document.getElementById('item-desc-ru').value.trim();
    const description_en = document.getElementById('item-desc-en').value.trim();
    const price = Number(document.getElementById('item-price').value.trim());
    const image_url = document.getElementById('item-image-url').value.trim();

    if (!category_id || !name_ru || !name_en || !price) {
        alert('Заполните category_id, названия и цену (число)');
        return;
    }

    try {
        const res = await fetch('/api/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                category_id,
                name_ru,
                name_en,
                description_ru,
                description_en,
                price,
                image_url,
            }),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            alert('Ошибка при добавлении позиции: ' + (data.error || res.status));
            return;
        }

        await loadMenu('ru', { forAdmin: true });

        document.getElementById('item-category-id').value = '';
        document.getElementById('item-name-ru').value = '';
        document.getElementById('item-name-en').value = '';
        document.getElementById('item-desc-ru').value = '';
        document.getElementById('item-desc-en').value = '';
        document.getElementById('item-price').value = '';
        document.getElementById('item-image-url').value = '';
    } catch (e) {
        console.error('handleAddItem error:', e);
        alert('Ошибка сети при добавлении позиции');
    }
}

async function handleDeleteItem(id) {
    if (!confirm('Удалить эту позицию?')) return;

    try {
        const res = await fetch(`/api/items/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            alert('Ошибка при удалении позиции');
            return;
        }
        await loadMenu('ru', { forAdmin: true });
    } catch (e) {
        console.error('handleDeleteItem error:', e);
        alert('Ошибка сети при удалении позиции');
    }
}

// =============== ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ onclick ===============
window.setRole = setRole;
window.backToRole = backToRole;

window.loadMenu = loadMenu;
window.openCategory = openCategory;
window.showCategoriesView = showCategoriesView;
window.selectCategory = selectCategory;
window.changeLanguage = changeLanguage;

window.handleAddCategory = handleAddCategory;
window.handleDeleteCategory = handleDeleteCategory;
window.handleAddItem = handleAddItem;
window.handleDeleteItem = handleDeleteItem;

// старт
render();
