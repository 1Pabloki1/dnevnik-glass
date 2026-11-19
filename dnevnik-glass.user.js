// ==UserScript==
// @name         Дневник: Glass Themes
// @namespace    https://github.com/1Pabloki1/dnevnik-glass
// @version      2.2.0
// @description  Тёмный glassmorphism-редизайн электронного дневника (Сетевой Город / edu.gounn.ru) с выбором цветовой гаммы. Кнопка-шестерёнка внизу справа открывает настройки.
// @author       1Pabloki1
// @license      MIT
// @match        *://*.gounn.ru/*
// @match        *://*.netschool.ru/*
// @exclude      *://*.gounn.ru/*mode=print*
// @exclude      *://*.netschool.ru/*mode=print*
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

(function () {
  'use strict';

  /* ============================ ТЕМЫ ============================ */

  const THEMES = {
    purple: {
      name: 'Неоновый фиолетовый',
      bg0: '#0e0b1f', bg1: '#161233', bg2: '#0b1226',
      glow1: 'rgba(124,92,255,.18)', glow2: 'rgba(79,124,255,.14)',
      card: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.09)',
      text: '#eae8f7', dim: '#9d97c0',
      accent: '#7c5cff', accent2: '#4f7cff', link: '#a793ff',
    },
    midnight: {
      name: 'Полночь',
      bg0: '#0a0f1e', bg1: '#0e1626', bg2: '#060a14',
      glow1: 'rgba(56,130,246,.16)', glow2: 'rgba(14,165,233,.10)',
      card: 'rgba(255,255,255,0.045)', border: 'rgba(255,255,255,0.08)',
      text: '#e6ecf5', dim: '#8fa0bd',
      accent: '#3b82f6', accent2: '#0ea5e9', link: '#7db4ff',
    },
    emerald: {
      name: 'Изумруд',
      bg0: '#07140f', bg1: '#0b1f17', bg2: '#04100b',
      glow1: 'rgba(16,185,129,.15)', glow2: 'rgba(52,211,153,.10)',
      card: 'rgba(255,255,255,0.045)', border: 'rgba(255,255,255,0.08)',
      text: '#e5f5ee', dim: '#8fb8a7',
      accent: '#10b981', accent2: '#34d399', link: '#6ee7b7',
    },
    sunset: {
      name: 'Закат',
      bg0: '#170b12', bg1: '#22101a', bg2: '#12060e',
      glow1: 'rgba(251,113,133,.16)', glow2: 'rgba(251,146,60,.12)',
      card: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.09)',
      text: '#f7e9ec', dim: '#c09aa6',
      accent: '#fb7185', accent2: '#fb923c', link: '#fda4af',
    },
    violet: {
      name: 'Розовая неона',
      bg0: '#150a1c', bg1: '#1f0f2b', bg2: '#0e0714',
      glow1: 'rgba(217,70,239,.16)', glow2: 'rgba(168,85,247,.12)',
      card: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.09)',
      text: '#f3e9f7', dim: '#b493c4',
      accent: '#d946ef', accent2: '#a855f7', link: '#e293f7',
    },
    mono: {
      name: 'Графит',
      bg0: '#101012', bg1: '#17171a', bg2: '#0a0a0c',
      glow1: 'rgba(255,255,255,.06)', glow2: 'rgba(255,255,255,.04)',
      card: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.10)',
      text: '#ececec', dim: '#9a9aa2',
      accent: '#e5e5e5', accent2: '#a3a3ad', link: '#c9c9d4',
    },
  };

  const LS_KEY = 'dg_theme';
  let current = localStorage.getItem(LS_KEY) || 'purple';
  if (!THEMES[current]) current = 'purple';
  let enabled = localStorage.getItem('dg_enabled') !== '0';

  /* ============================ CSS ============================ */

  const css = `
:root {
  --dg-bg0: {bg0}; --dg-bg1: {bg1}; --dg-bg2: {bg2};
  --dg-glow1: {glow1}; --dg-glow2: {glow2};
  --dg-card: {card}; --dg-border: {border};
  --dg-text: {text}; --dg-dim: {dim};
  --dg-accent: {accent}; --dg-accent2: {accent2}; --dg-link: {link};
}

html, body {
  background: radial-gradient(1200px 800px at 80% -10%, var(--dg-glow1), transparent 60%),
              radial-gradient(1000px 700px at -10% 30%, var(--dg-glow2), transparent 55%),
              linear-gradient(160deg, var(--dg-bg0), var(--dg-bg1) 60%, var(--dg-bg2)) !important;
  background-attachment: fixed !important;
  color: var(--dg-text) !important;
}

/* весь лейаут прозрачный */
.layout, .layout-base, .layout-content, .layout-content--header,
.m-navigation, .m-panel, .m-panel-fake, .navigation-top-fake,
.layout-main, .layout-base__main,
.dnevnik-header, .dnevnik-header__content, .dnevnik,
.m-menu__items, .m-menu__click,
.grid-header, .table_header_container, .table_header_fixed, .inside {
  background: transparent !important;
}
/* светлые разделительные линии между шапкой и телом */
.layout-main, .layout-content, .layout-base__header { border-color: var(--dg-border) !important; }

/* ---------- шапка ---------- */
.layout-base__header, .header {
  background: color-mix(in srgb, var(--dg-bg0) 72%, transparent) !important;
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--dg-border);
}
.logotype__title, .logotype__subtitle,
.m-logo__title, .m-logo__subtitle,
.navigation-top-item__label {
  color: var(--dg-text) !important;
}
.navigation-top-item:hover .navigation-top-item__label { color: #fff !important; }

/* ---------- главное меню ---------- */
.menu0 {
  background: var(--dg-card) !important;
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  border: 1px solid var(--dg-border);
  border-radius: 16px !important;
  overflow: hidden;
  align-items: stretch;
  padding: 8px 10px !important;
}
/* пункты меню высотой больше самой полосы — иконки вылезали за края */
.menu0-item {
  background: transparent !important;
  height: auto !important;
  min-height: 0 !important;
  display: flex !important;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.menu0-item__icon {
  flex: none;
  width: 24px !important;
  height: 24px !important;
  margin: 0 auto 3px;
  background-size: contain !important;
}
.menu0-item__title { color: var(--dg-dim) !important; }
.menu0-item:hover .menu0-item__title { color: #fff !important; }
.menu0-item--active {
  background: linear-gradient(135deg, var(--dg-accent), var(--dg-accent2)) !important;
  box-shadow: 0 0 18px color-mix(in srgb, var(--dg-accent) 45%, transparent);
}
.menu0-item--active .menu0-item__title { color: #fff !important; }

/* ---------- вкладки разделов ---------- */
.navigation-tabs__inner {
  background: var(--dg-card) !important;
  border: 1px solid var(--dg-border);
  border-radius: 14px;
}
.navigation-tabs__item, .navigation-tabs__period { color: var(--dg-dim) !important; }
.navigation-tabs__item.active, .navigation-tabs__item--active,
.navigation-tabs__period.active {
  color: #fff !important;
  background: linear-gradient(135deg, var(--dg-accent), var(--dg-accent2)) !important;
  border-radius: 10px;
  box-shadow: 0 0 14px color-mix(in srgb, var(--dg-accent) 40%, transparent);
}

/* ---------- карточки дней ---------- */
.dnevnik-day {
  background: var(--dg-card) !important;
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  border: 1px solid var(--dg-border) !important;
  border-radius: 18px !important;
  box-shadow: 0 10px 34px rgba(0, 0, 0, .38) !important;
  overflow: hidden;
}
.dnevnik-day__header {
  background: linear-gradient(90deg, color-mix(in srgb, var(--dg-accent) 22%, transparent), color-mix(in srgb, var(--dg-accent2) 8%, transparent) 70%, transparent) !important;
  border-bottom: 1px solid var(--dg-border) !important;
}
.dnevnik-day__title { color: #fff !important; }
.dnevnik-day__date, .dnevnik-day__subtitle { color: var(--dg-dim) !important; }

/* строки уроков */
.dnevnik-lesson, .dnevnik-lesson:nth-child(odd), .dnevnik-lesson:nth-child(even) {
  background: transparent !important;
  color: var(--dg-text) !important;
  border-color: rgba(255, 255, 255, 0.06) !important;
}
.dnevnik-lesson:hover { background: rgba(255, 255, 255, 0.045) !important; }
.dnevnik-lesson__subject { color: #fff !important; }
.dnevnik-lesson__time, .dnevnik-lesson__number, .dnevnik-lesson__number--time {
  color: var(--dg-dim) !important;
}
.dnevnik-lesson__task, .dnevnik-lesson__hometask { color: var(--dg-text) !important; }

/* оценки */
.dnevnik-mark {
  background: linear-gradient(135deg, var(--dg-accent), var(--dg-accent2)) !important;
  color: #fff !important;
  border-radius: 9px !important;
  box-shadow: 0 0 14px color-mix(in srgb, var(--dg-accent) 55%, transparent) !important;
}
.dnevnik-mark--absent, .dnevnik-mark__value--absent,
.dnevnik-mark[style*="color"] {
  background: rgba(255, 92, 130, .16) !important;
  color: #ff8aa5 !important;
  box-shadow: 0 0 12px rgba(255, 92, 130, .35) !important;
}

/* ссылки и кнопки */
a { color: var(--dg-link) !important; }
a:hover { color: #fff !important; }
.btn, button, .context__item, .dnevnik-weeks a { border-radius: 10px !important; }
.dnevnik-weeks a, .context--dropdown, .context__block, .context__content {
  background: color-mix(in srgb, var(--dg-bg1) 92%, transparent) !important;
  color: var(--dg-text) !important;
  border: 1px solid var(--dg-border);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
}
.context__item:hover { background: color-mix(in srgb, var(--dg-accent) 22%, transparent) !important; }

/* таблицы */
.dnevnik, .marks-table, table { color: var(--dg-text) !important; }
td, th { border-color: rgba(255, 255, 255, 0.08) !important; }

/* таблица оценок (Успеваемость) */
.cell, .cells, .cell-data, .cell_titled, .lhCell, .offset16 {
  background: transparent !important;
  color: var(--dg-text) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}
.cells_marks.cells__hoverable:hover { background: color-mix(in srgb, var(--dg-accent) 14%, transparent) !important; }
.cell.istarget.red, .cell.red { color: #ff8aa5 !important; background: rgba(255, 92, 130, 0.12) !important; }
.cell.colors1, .cell.colors2 { color: #8affc1 !important; }
.cell.colors3 { color: #ffe08a !important; }
.cell.colors4, .cell.colors5 { color: var(--dg-link) !important; }
.cell_avg_not_enough { color: #ff8aa5 !important; }
.page-title, .page-title * { color: var(--dg-text) !important; }

/* портал /elk и прочие страницы с хешированными классами —
   «отбеливатель» дорисовывает стили в рантайме (см. flattenWhite ниже) */
.dg-flattened { background: transparent !important; }
.dg-flattened::before, .dg-flattened::after {
  background-image: none !important;
  background-color: transparent !important;
}
.dg-glass {
  background: var(--dg-card) !important;
  border: 1px solid var(--dg-border) !important;
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
}
.page, .content, .links, .copyright { color: var(--dg-dim) !important; }

/* футер */
.footer, .footer-menu, .footer-apps { background: transparent !important; color: var(--dg-dim) !important; }
.footer-menu__item { color: var(--dg-dim) !important; }

/* печать — сброс к светлому, чтобы не жрать краску */
@media print {
  html, body { background: #fff !important; color: #000 !important; }
  * { background: transparent !important; color: #000 !important; box-shadow: none !important; text-shadow: none !important; }
}

/* скроллбар */
::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: color-mix(in srgb, var(--dg-accent) 35%, transparent); border-radius: 8px; }

/* ---------- панель настроек ---------- */
.dg-fab {
  position: fixed; right: 18px; bottom: 18px; z-index: 999999;
  width: 46px; height: 46px; border-radius: 50%;
  border: 1px solid var(--dg-border);
  background: linear-gradient(135deg, var(--dg-accent), var(--dg-accent2));
  box-shadow: 0 6px 24px color-mix(in srgb, var(--dg-accent) 50%, transparent);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: transform .15s ease;
}
.dg-fab:hover { transform: scale(1.08); }
.dg-fab svg { width: 22px; height: 22px; fill: #fff; }

.dg-panel {
  position: fixed; right: 18px; bottom: 76px; z-index: 999999;
  width: 300px; border-radius: 20px;
  background: color-mix(in srgb, var(--dg-bg1) 88%, transparent);
  -webkit-backdrop-filter: blur(24px);
  backdrop-filter: blur(24px);
  border: 1px solid var(--dg-border);
  box-shadow: 0 20px 60px rgba(0,0,0,.5);
  color: var(--dg-text);
  font: 14px/1.45 -apple-system, 'Segoe UI', Roboto, sans-serif;
  padding: 18px;
  display: none;
}
.dg-panel.dg-open { display: block; }
.dg-panel h3 { margin: 0 0 4px; font-size: 16px; color: #fff; }
.dg-panel .dg-sub { margin: 0 0 14px; font-size: 12px; color: var(--dg-dim); }
.dg-themes { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.dg-theme {
  border: 2px solid transparent; border-radius: 14px; padding: 10px;
  cursor: pointer; text-align: center;
  background: rgba(255,255,255,.04);
  transition: border-color .15s, background .15s;
}
.dg-theme:hover { background: rgba(255,255,255,.08); }
.dg-theme.dg-active { border-color: var(--dg-accent); }
.dg-swatch {
  height: 34px; border-radius: 9px; margin-bottom: 8px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.12);
}
.dg-theme span { font-size: 12px; color: var(--dg-text); }
.dg-toggle-row {
  margin-top: 14px; display: flex; align-items: center; justify-content: space-between;
  font-size: 13px; color: var(--dg-text);
}
.dg-switch { position: relative; width: 40px; height: 22px; cursor: pointer; }
.dg-switch input { opacity: 0; width: 0; height: 0; }
.dg-slider {
  position: absolute; inset: 0; border-radius: 22px;
  background: rgba(255,255,255,.15); transition: .2s;
}
.dg-slider:before {
  content: ''; position: absolute; width: 16px; height: 16px; border-radius: 50%;
  left: 3px; top: 3px; background: #fff; transition: .2s;
}
.dg-switch input:checked + .dg-slider { background: linear-gradient(135deg, var(--dg-accent), var(--dg-accent2)); }
.dg-switch input:checked + .dg-slider:before { transform: translateX(18px); }
.dg-gh { display: block; margin-top: 12px; font-size: 12px; color: var(--dg-dim); text-decoration: none; }
`;

  const style = document.createElement('style');
  style.id = 'dg-style';
  (function attach() {
    if (style.parentNode) return; // уже вставлен (SPA-переходы)
    const root = document.head || document.documentElement;
    if (root) root.appendChild(style);
    else setTimeout(attach, 10);
  })();
  // SPA периодически вычищает чужие <style> из <head> — возвращаем наш, если удалили
  (function watchHead() {
    if (!document.head) return setTimeout(watchHead, 100);
    new MutationObserver(() => {
      if (!style.isConnected) {
        (document.head || document.documentElement).appendChild(style);
        applyTheme(current);
      }
    }).observe(document.head, { childList: true });
  })();

  function applyTheme(name) {
    current = THEMES[name] ? name : 'purple';
    style.textContent = css.replace(/\{(\w+)\}/g, (_, k) => THEMES[current][k] || '');
    document.querySelectorAll('.dg-theme').forEach(el =>
      el.classList.toggle('dg-active', el.dataset.theme === current));
    document.getElementById('dg-fab').style.background =
      `linear-gradient(135deg, ${THEMES[current].accent}, ${THEMES[current].accent2})`;
  }

  function setEnabled(on) {
    enabled = on;
    localStorage.setItem('dg_enabled', on ? '1' : '0');
    style.textContent = on ? style.textContent : '';
    document.getElementById('dg-fab').style.display = on ? 'flex' : 'none';
    if (on) applyTheme(current);
    panel.style.display = 'none';
  }

  /* ---------- «отбеливатель» для страниц с хешированными классами (/elk и т.п.) ----------
     Сайт портала собран с CSS-модулями: классы вида fmwT93fx... меняются каждый релиз,
     статическими селекторами их не поймать. Поэтому для нежурнальных страниц
     снимаем белые фоны и тёмный текст напрямую с элементов. */
  const DARK_TEXT = ['rgb(33, 32, 36)', 'rgb(0, 0, 0)', 'rgb(17, 24, 39)', 'rgb(24, 24, 27)', 'rgb(31, 41, 55)'];
  const rgbOf = col => (col || '').match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  const isDarkText = col => {
    const m = rgbOf(col);
    return !!m && +m[1] < 90 && +m[2] < 90 && +m[3] < 100; // тёмный текст (ссылки с синим не попадают)
  };
  // любой «почти белый/пастельный» фон — под нож
  const isLightBg = bg => {
    const m = rgbOf(bg);
    if (!m) return false;
    const a = bg.match(/rgba\(\d+,\s*\d+,\s*\d+,\s*([\d.]+)/);
    if (a && parseFloat(a[1]) < 1) return false; // полупрозрачные не трогаем
    return +m[1] > 200 && +m[2] > 200 && +m[3] > 200;
  };
  // элемент внутри реально светлой (неотбеленной) коробки — его текст не перекрашиваем
  function inLightBox(el) {
    let p = el.parentElement;
    while (p) {
      const bg = getComputedStyle(p).backgroundColor;
      if (bg !== 'rgba(0, 0, 0, 0)') return isLightBg(bg) && !p.classList.contains('dg-flattened');
      p = p.parentElement;
    }
    return false;
  }
  let flattenTimer = null;

  function flattenWhite() {
    if (!enabled) return;
    // статически покрытые страницы — там только подстравка шапки (см. patchHeader)
    if (/journal-app|mode=print/i.test(location.pathname + location.search)) return;
    patchHeader();
    const els = document.querySelectorAll('div,section,header,footer,main,nav,aside,ul,li,table,thead,tbody,tr,td,th,form,fieldset,p,h1,h2,h3,h4,a');
    for (const el of els) {
      const c = getComputedStyle(el);
      if (isLightBg(c.backgroundColor)) {
        el.classList.add('dg-flattened');
        const r = el.getBoundingClientRect();
        if (r.width > 220 && r.height > 70 && parseFloat(c.borderRadius) >= 4) el.classList.add('dg-glass');
      }
      if (isDarkText(c.color) && !inLightBox(el)) el.style.setProperty('color', 'var(--dg-text)', 'important');
    }
  }

  function scheduleFlatten() {
    clearTimeout(flattenTimer);
    flattenTimer = setTimeout(() => { flattenWhite(); patchHeader(); }, 300);
  }

  // инлайн-подстраховка для sticky-шапок журнала (SPA их пересоздаёт и красит в белый).
  // shortcut: только background-color — шортхенд `background` сбрасывает background-* longhands,
  // на которые завязана sticky-логика сайта (ломал вёрстку таблицы оценок).
  function patchHeader() {
    if (!/journal-app|journal-student-grades/i.test(location.pathname)) return;
    document.querySelectorAll('.dnevnik-header, .dnevnik-header__content, .grid-header, .table_header_container, .table_header_fixed').forEach(el => {
      el.style.setProperty('background-color', 'transparent', 'important');
    });
  }

  /* ---------- панель ---------- */

  const fab = document.createElement('div');
  fab.className = 'dg-fab';
  fab.id = 'dg-fab';
  fab.title = 'Тема дневника';
  fab.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0 0 20 1.7 1.7 0 0 0 1.2-2.8 1.7 1.7 0 0 1 1.3-2.7H17a5 5 0 0 0 5-5c0-5-4.6-9.5-10-9.5zM6.5 12A1.5 1.5 0 1 1 8 10.5 1.5 1.5 0 0 1 6.5 12zm4-4A1.5 1.5 0 1 1 12 6.5 1.5 1.5 0 0 1 10.5 8zm5 0A1.5 1.5 0 1 1 17 6.5 1.5 1.5 0 0 1 15.5 8zm3 4A1.5 1.5 0 1 1 20 10.5 1.5 1.5 0 0 1 18.5 12z"/></svg>';

  const panel = document.createElement('div');
  panel.className = 'dg-panel';
  panel.innerHTML = `
    <h3>🎨 Тема дневника</h3>
    <p class="dg-sub">Выбор сохраняется автоматически</p>
    <div class="dg-themes">
      ${Object.entries(THEMES).map(([key, t]) => `
        <div class="dg-theme${key === current ? ' dg-active' : ''}" data-theme="${key}">
          <div class="dg-swatch" style="background:linear-gradient(135deg, ${t.bg0}, ${t.bg1} 55%, ${t.accent})"></div>
          <span>${t.name}</span>
        </div>`).join('')}
    </div>
    <div class="dg-toggle-row">
      <span>Редизайн включён</span>
      <label class="dg-switch"><input type="checkbox" id="dg-enabled" ${enabled ? 'checked' : ''}><span class="dg-slider"></span></label>
    </div>
    <a class="dg-gh" href="https://github.com/1Pabloki1/dnevnik-glass" target="_blank">GitHub: dnevnik-glass</a>
  `;

  fab.addEventListener('click', () => {
    panel.classList.toggle('dg-open');
  });
  panel.addEventListener('click', e => {
    const t = e.target.closest('.dg-theme');
    if (t) {
      applyTheme(t.dataset.theme);
      localStorage.setItem(LS_KEY, t.dataset.theme);
    }
  });

  function mount() {
    if (document.getElementById('dg-fab')) return; // уже смонтировано (SPA-переходы)
    if (!document.body) return setTimeout(mount, 50);
    document.body.appendChild(fab);
    document.body.appendChild(panel);
    panel.querySelector('#dg-enabled').addEventListener('change', e => setEnabled(e.target.checked));
    if (enabled) applyTheme(current);
    else { style.textContent = ''; fab.style.display = 'none'; }
    flattenWhite();
    scheduleFlatten();
    new MutationObserver(scheduleFlatten).observe(document.body, { childList: true, subtree: true });
    // SPA иногда рендерит контент без childList-мутаций — страхуемся интервалом на старте
    let boots = 0;
    const boot = setInterval(() => {
      scheduleFlatten();
      if (++boots > 10) clearInterval(boot);
    }, 2000);
  }
  mount();
})();
