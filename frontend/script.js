const app = document.getElementById("app");

const state = {
  lang: null,           
  menuData: [],         
  currentCategoryId: null,
  view: 'language',     
};

async function loadMenu(lang) {
  state.lang = lang;

  try {
    const res = await fetch(`/api/menu?lang=${lang}`);
    state.menuData = await res.json();

    state.currentCategoryId = null;
    state.view = 'categories';

    render();
  } catch (e) {
    console.error("Ошибка загрузки меню:", e);
    app.innerHTML = "<p>Ошибка загрузки меню. Попробуйте позже.</p>";
  }
}

function render() {
  if (!state.lang || state.view === 'language') {
    renderLanguageScreen();
  } else {
    renderMenuScreen();
  }
}

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
    </div>
  `;
}

function renderMenuScreen() {
  const categories = state.menuData;

  if (!categories || categories.length === 0) {
    app.innerHTML = "<p>Меню пустое.</p>";
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

        <div class="lang-switch">
          <button class="lang-btn ${state.lang === 'ru' ? 'active' : ''}" onclick="changeLanguage('ru')">RU</button>
          <button class="lang-btn ${state.lang === 'en' ? 'active' : ''}" onclick="changeLanguage('en')">EN</button>
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

window.loadMenu = loadMenu;
window.selectCategory = selectCategory;
window.changeLanguage = changeLanguage;
window.openCategory = openCategory;
window.showCategoriesView = showCategoriesView;

render();
