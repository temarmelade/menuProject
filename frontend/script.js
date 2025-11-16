const app = document.getElementById("app");

const state = {
  lang: null,           // 'ru' | 'en'
  menuData: [],         // [{ id, name, imageUrl, items: [...] }]
  currentCategoryId: null,
};

async function loadMenu(lang) {
  state.lang = lang;

  try {
    const res = await fetch(`/api/menu?lang=${lang}`);
    state.menuData = await res.json();

    if (!state.currentCategoryId && state.menuData.length > 0) {
      state.currentCategoryId = state.menuData[0].id;
    }

    render();
  } catch (e) {
    console.error("Ошибка загрузки меню:", e);
    app.innerHTML = "<p>Ошибка загрузки меню. Попробуйте позже.</p>";
  }
}

function render() {
  if (!state.lang) {
    renderLanguageScreen();
  } else {
    renderMenuScreen();
  }
}

function renderLanguageScreen() {
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
    </div>
  `;
}

function renderMenuScreen() {
  const categories = state.menuData;

  if (!categories || categories.length === 0) {
    app.innerHTML = "<p>Меню пустое.</p>";
    return;
  }

  if (!state.currentCategoryId) {
    state.currentCategoryId = categories[0].id;
  }

  const activeCategory = categories.find(c => c.id === state.currentCategoryId) || categories[0];

  app.innerHTML = `
    <div class="screen">
      <div class="header">
        <div class="brand">
          <div class="brand-logo">☕️</div>
          <div class="brand-text">
            <div class="brand-title">T&E Coffee</div>
          </div>
        </div>

        <div class="lang-switch">
          <button class="lang-btn ${state.lang === 'ru' ? 'active' : ''}" onclick="changeLanguage('ru')">RU</button>
          <button class="lang-btn ${state.lang === 'en' ? 'active' : ''}" onclick="changeLanguage('en')">EN</button>
        </div>
      </div>

      <div class="menu-header">
        <h1>${state.lang === 'ru' ? 'Меню' : 'Menu'}</h1>
        <p>${state.lang === 'ru'
      ? 'Выберите категорию и откройте для себя наши позиции.'
      : 'Choose a category to explore our dishes and drinks.'}</p>
      </div>

      <div class="category-tabs">
        ${categories.map(cat => `
          <button
            class="category-tab ${cat.id === activeCategory.id ? 'active' : ''}"
            onclick="selectCategory(${cat.id})"
          >
            ${cat.name}
          </button>
        `).join('')}
      </div>

      <div class="items-grid">
        ${activeCategory.items.map(item => `
          <div class="item-card">
            <div class="item-image-wrapper">
              <img src="${item.image_url || item.imageUrl}" alt="${item.name}" loading="lazy" />
            </div>
            <div class="item-body">
              <div class="item-title-row">
                <div class="item-name">${item.name}</div>
                <div class="item-price">${item.price} ${state.lang === 'ru' ? 'сом' : 'KGS'}</div>
              </div>
              <div class="item-desc">${item.description || ''}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function selectCategory(id) {
  state.currentCategoryId = id;
  render();
}

function changeLanguage(lang) {
  if (lang === state.lang) return;
  loadMenu(lang);
}

window.loadMenu = loadMenu;
window.selectCategory = selectCategory;
window.changeLanguage = changeLanguage;

render();