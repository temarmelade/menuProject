const app = document.getElementById("app");

const state = {
  lang: null,           
  menuData: [],        
  currentCategoryId: null,
};

// Загрузка меню с сервера
async function loadMenu(lang) {
  state.lang = lang;

  try {
    const res = await fetch(`/api/menu?lang=${lang}`);
    state.menuData = await res.json();
    state.currentCategoryId = null;
    render();
  } catch (e) {
    console.error("Ошибка загрузки меню:", e);
    app.innerHTML = "<p>Ошибка загрузки меню. Попробуйте позже.</p>";
  }
}

function render() {
  if (!state.lang) {
    renderLanguageScreen();
  } else if (!state.currentCategoryId) {
    renderCategoriesScreen();
  } else {
    renderItemsScreen();
  }
}

// ========== ЭКРАН ВЫБОРА ЯЗЫКА ==========
function renderLanguageScreen() {
  app.innerHTML = `
    <div class="screen">
      <h1>Выберите язык / Choose language</h1>
      <button class="button" onclick="loadMenu('ru')">Русский</button>
      <button class="button secondary" onclick="loadMenu('en')">English</button>
    </div>
  `;
}

// ========== ЭКРАН КАТЕГОРИЙ ==========
function renderCategoriesScreen() {
  const categories = state.menuData;

  app.innerHTML = `
    <div class="screen">
      <div class="nav-top">
        <h1>${state.lang === 'ru' ? 'Категории' : 'Categories'}</h1>
        <div class="lang-label">${state.lang === 'ru' ? 'Русский' : 'English'}</div>
      </div>

      <div class="grid">
        ${categories.map(cat => `
          <div class="card" onclick="selectCategory(${cat.id})">
            <img src="${cat.imageUrl}" alt="${cat.name}" loading="lazy" />
            <div class="card-body">${cat.name}</div>
          </div>
        `).join('')}
      </div>

      <button class="button secondary" onclick="changeLanguage()">
        ${state.lang === 'ru' ? 'English version' : 'Русская версия'}
      </button>
    </div>
  `;
}

function selectCategory(id) {
  state.currentCategoryId = id;
  render();
}

function changeLanguage() {
  const newLang = state.lang === 'ru' ? 'en' : 'ru';
  loadMenu(newLang);
}

// ========== ЭКРАН ПОЗИЦИЙ КАТЕГОРИИ ==========
function renderItemsScreen() {
  const category = state.menuData.find(c => c.id === state.currentCategoryId);
  if (!category) {
    state.currentCategoryId = null;
    render();
    return;
  }

  app.innerHTML = `
    <div class="screen">
      <div class="nav-top">
        <button class="back-btn" onclick="goBack()">
          ${state.lang === 'ru' ? 'Назад' : 'Back'}
        </button>
        <div class="lang-label">${state.lang === 'ru' ? 'Русский' : 'English'}</div>
      </div>

      <div class="breadcrumbs">
        ${state.lang === 'ru' ? 'Категории' : 'Categories'} › ${category.name}
      </div>

      <h2>${category.name}</h2>

      <div class="item-list">
        ${category.items.map(item => `
          <div class="item-card">
            <img src="${item.image_url || item.imageUrl}" alt="${item.name}" loading="lazy" />
            <div class="item-info">
              <div class="item-name">${item.name}</div>
              <div class="item-desc">${item.description || ''}</div>
              <div class="item-price">${item.price} ${state.lang === 'ru' ? 'сом' : 'KGS'}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function goBack() {
  state.currentCategoryId = null;
  render();
}

render();

window.loadMenu = loadMenu;
window.selectCategory = selectCategory;
window.changeLanguage = changeLanguage;
window.goBack = goBack;
