/* ====== shared state ====== */

const STORAGE_KEY = "monomarket_prototype_v1";

const DEFAULT_STATE = {
  products: [
    {
      id: "ps5",
      name: "Ігрова консоль Sony PlayStation 5 Pro",
      seller: "Фокстрот",
      sellerEmoji: "🦊",
      price: 24999,
      oldPrice: null,
      qty: 1,
      selected: false,
      installments: 8,
      image: "ps5",
    },
    {
      id: "iphone17",
      name: "Смартфон Apple iPhone 17 Pro Max 512",
      seller: "КТС",
      sellerEmoji: "ktc",
      price: 31199,
      oldPrice: 44999,
      qty: 2,
      selected: true,
      installments: 12,
      image: "iphone",
    },
    {
      id: "asus-tuf",
      name: "Ноутбук ігровий Asus TUF Gaming F15",
      seller: "Розетка",
      sellerEmoji: "🛒",
      price: 31992,
      oldPrice: null,
      qty: 1,
      selected: false,
      installments: 8,
      image: "laptop",
    },
    {
      id: "mx-master",
      name: "Миша Logitech MX Master 3S",
      seller: "Розетка",
      sellerEmoji: "🛒",
      price: 3192,
      oldPrice: null,
      qty: 1,
      selected: false,
      installments: 12,
      image: "mouse",
    },
  ],
  payment: "full", // 'full' | 'parts'
  delivery: "courier", // 'courier' | 'department'
  addresses: [
    { id: "a1", street: "вул. Старокозацька, 62А", city: "м. Дніпро", note: "Безкоштовно у квартиру" },
    { id: "a2", street: "просп. Лесі Українки, 26", city: "м. Київ", note: "До дверей" },
  ],
  selectedAddressId: "a1",
  departments: [
    { id: "d1", number: "27", street: "вул. Пироговський шлях, 136", city: "м. Одеса", weight: "до 30 кг", icon: "📦", recent: true },
    { id: "d2", number: "28277", street: "вул. Федорова, 32 (м. Олімпійська)", city: "м. Одеса", weight: "до 20 кг", icon: "📮", isPostmat: true, recent: true },
    { id: "d3", number: "1", street: "Київське шосе, 27", city: "м. Одеса", weight: "до 1100 кг", icon: "🚚" },
    { id: "d4", number: "2", street: "вул. Базова, 16", city: "м. Одеса", weight: "до 1100 кг", icon: "🚚" },
    { id: "d5", number: "3", street: "вул. Дальницька, 23/4", city: "м. Одеса", weight: "до 30 кг", icon: "📦" },
    { id: "d6", number: "4", street: "вул. Федорова, 32 (м. Олімпійська)", city: "м. Одеса", weight: "до 20 кг", icon: "📦" },
  ],
  selectedDepartmentId: "d1",
  recipients: [
    { id: "r1", name: "Микола Новіков", phone: "+380 (95) 123 45 67", avatar: "photo" },
    { id: "r2", name: "Жанна Новікова", phone: "+380 (95) 123 45 67", avatar: "orange", initials: "ЖН" },
    { id: "r3", name: "Макс Жданов", phone: "+380 (95) 123 45 67", avatar: "purple", initials: "МЖ" },
  ],
  selectedRecipientId: "r1",
  card: "black", // 'black' | 'white'
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      return { ...DEFAULT_STATE, ...saved };
    }
  } catch (e) {}
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function saveState(s) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

function resetState() {
  localStorage.removeItem(STORAGE_KEY);
}

let state = loadState();

/* ====== helpers ====== */

function fmt(n) {
  return Math.round(n).toLocaleString("uk-UA").replace(/,/g, " ") + " ₴";
}

function selectedProducts() {
  return state.products.filter((p) => p.selected);
}

function cartTotal() {
  return selectedProducts().reduce((s, p) => s + p.price * p.qty, 0);
}

function selectedCount() {
  return selectedProducts().reduce((s, p) => s + p.qty, 0);
}

function firstInstallment() {
  return selectedProducts().reduce((s, p) => s + Math.round((p.price * p.qty) / p.installments), 0);
}

function getSelectedAddress() {
  return state.addresses.find((a) => a.id === state.selectedAddressId);
}

function getSelectedDepartment() {
  return state.departments.find((d) => d.id === state.selectedDepartmentId);
}

function getSelectedRecipient() {
  return state.recipients.find((r) => r.id === state.selectedRecipientId);
}

function getSelectedCard() {
  return state.card === "black"
    ? { name: "Чорна картка", balance: 50450.25, art: "black" }
    : { name: "Біла картка", balance: 29191.87, art: "white" };
}

/* ====== icons ====== */

const ICONS = {
  arrow: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  share: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 13.5V3M11 3L7 7M11 3L15 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 11V17C5 17.5523 5.44772 18 6 18H16C16.5523 18 17 17.5523 17 17V11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  cart: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 4H5L7 14H16L18 7H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="17" r="1.3" fill="currentColor"/><circle cx="15" cy="17" r="1.3" fill="currentColor"/></svg>`,
  pencil: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9.5 1.5L12.5 4.5L4.5 12.5H1.5V9.5L9.5 1.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  trash: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 5H15M7 5V3.5C7 3.22 7.22 3 7.5 3H10.5C10.78 3 11 3.22 11 3.5V5M5 5L5.6 14.5C5.62 14.78 5.85 15 6.13 15H11.87C12.15 15 12.38 14.78 12.4 14.5L13 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  chevron: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 5L13 10L8 15" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  search: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.7"/><path d="M12.5 12.5L15.5 15.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
  np: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 4V18M4 11H18M14 7L18 11L14 15M8 7L4 11L8 15" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  paw: `<svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor"><circle cx="6" cy="8" r="2"/><circle cx="11" cy="6" r="2"/><circle cx="16" cy="8" r="2"/><circle cx="4" cy="13" r="1.6"/><circle cx="18" cy="13" r="1.6"/><path d="M11 9.5C8.5 9.5 6.5 12 6.5 14.5C6.5 16.5 8 17.5 11 17.5C14 17.5 15.5 16.5 15.5 14.5C15.5 12 13.5 9.5 11 9.5Z"/></svg>`,
  card: `<svg width="40" height="28" viewBox="0 0 40 28" fill="none"><rect x="1" y="1" width="38" height="26" rx="5" fill="#16171C"/><rect x="1" y="6" width="38" height="6" fill="#222226"/><circle cx="9" cy="20" r="3.5" fill="#52525B"/></svg>`,
  info: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8.5" stroke="currentColor" stroke-width="1.6"/><path d="M10 9V14M10 6.5V6.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  handshake: `🤝`,
  plus: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5V12.5M1.5 7H12.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  signal: `<svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0.5" y="8" width="2.5" height="3.5" rx="0.6"/><rect x="4.5" y="6" width="2.5" height="5.5" rx="0.6"/><rect x="8.5" y="3.5" width="2.5" height="8" rx="0.6"/><rect x="12.5" y="0.5" width="2.5" height="11" rx="0.6"/></svg>`,
  wifi: `<svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 11.2C8.7 11.2 9.3 10.6 9.3 9.9C9.3 9.2 8.7 8.6 8 8.6C7.3 8.6 6.7 9.2 6.7 9.9C6.7 10.6 7.3 11.2 8 11.2Z"/><path d="M3.4 6.6C4.7 5.4 6.3 4.7 8 4.7C9.7 4.7 11.3 5.4 12.6 6.6L13.7 5.5C12.1 4 10.1 3.2 8 3.2C5.9 3.2 3.9 4 2.3 5.5L3.4 6.6Z"/><path d="M0.7 3.9C2.7 1.9 5.3 0.8 8 0.8C10.7 0.8 13.3 1.9 15.3 3.9L16.4 2.8C14.1 0.5 11.1 -0.7 8 -0.7C4.9 -0.7 1.9 0.5 -0.4 2.8L0.7 3.9Z"/></svg>`,
  battery: `<svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="3" stroke="currentColor"/><rect x="2" y="2" width="19" height="8" rx="1.5" fill="currentColor"/><rect x="23.5" y="4" width="2" height="4" rx="1" fill="currentColor"/></svg>`,
};

/* ====== product images (small inline SVG illustrations) ====== */

const PRODUCT_IMAGES = {
  ps5: `<svg viewBox="0 0 80 64" fill="none"><rect x="6" y="14" width="40" height="40" rx="3" fill="#fff" stroke="#1F2937" stroke-width="1.2"/><rect x="10" y="18" width="32" height="6" fill="#1F2937"/><rect x="44" y="18" width="2" height="32" fill="#94A3B8"/><path d="M48 28 H 70 Q 76 28 76 34 V 50 Q 76 56 70 56 H 48 V 28Z" fill="#fff" stroke="#1F2937" stroke-width="1.2"/><circle cx="56" cy="42" r="3.5" fill="#1F2937"/><circle cx="68" cy="42" r="3.5" fill="#1F2937"/></svg>`,
  iphone: `<svg viewBox="0 0 64 64" fill="none"><rect x="18" y="6" width="34" height="56" rx="6" fill="#1F2937"/><rect x="20" y="11" width="30" height="46" rx="3" fill="#0F172A"/><rect x="38" y="14" width="9" height="9" rx="2" fill="#1F2937" stroke="#0B0F19"/><circle cx="40" cy="16" r="1.3" fill="#0B0F19"/><circle cx="44.5" cy="16" r="1.3" fill="#0B0F19"/><circle cx="40" cy="20.5" r="1.3" fill="#0B0F19"/></svg>`,
  laptop: `<svg viewBox="0 0 80 56" fill="none"><path d="M14 8 L66 8 L70 38 L10 38 Z" fill="#1F2937"/><rect x="18" y="12" width="44" height="22" rx="1.5" fill="#0F172A"/><text x="40" y="27" font-size="10" font-weight="700" fill="#FACC15" text-anchor="middle" font-family="-apple-system">TUF</text><rect x="6" y="38" width="68" height="6" rx="2" fill="#374151"/></svg>`,
  mouse: `<svg viewBox="0 0 64 64" fill="none"><path d="M22 10 Q 32 6 42 10 Q 52 14 52 32 Q 52 56 32 56 Q 12 56 12 32 Q 12 14 22 10Z" fill="#fff" stroke="#1F2937" stroke-width="1.2"/><path d="M32 10 Q 32 24 32 32" stroke="#9CA3AF" stroke-width="1"/><circle cx="32" cy="22" r="3" fill="#9CA3AF"/></svg>`,
};

/* ====== rendering helpers ====== */

function statusBar(white = false) {
  return `
    <div class="status-bar">
      <div class="status-bar__time">19:12</div>
      <div class="status-bar__icons">
        ${ICONS.signal}${ICONS.wifi}${ICONS.battery}
      </div>
    </div>`;
}

function backHeader({ title, white = false, action = "" }) {
  return `
    <div class="header">
      <button class="header__back ${white ? "header__back--white" : ""}" data-action="back">${ICONS.arrow}</button>
      <h1 class="header__title ${white ? "header__title--white" : ""}">${title || ""}</h1>
      ${action || `<div class="header__action" style="visibility:hidden">${ICONS.share}</div>`}
    </div>`;
}

function tabBar(active = "cart") {
  const items = [
    { id: "bank", label: "Банк", icon: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="6" width="14" height="9" rx="2" stroke="currentColor" stroke-width="1.7"/><rect x="6" y="9" width="14" height="9" rx="2" stroke="currentColor" stroke-width="1.7"/></svg>' },
    { id: "main", label: "Головна", icon: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M5 9V18H17V9M3 11L11 4L19 11" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { id: "cabinet", label: "Кабінет", icon: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 3L3 7V11C3 15 6 18 11 19C16 18 19 15 19 11V7L11 3Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M11 11L11 13" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>' },
    { id: "cart", label: "Кошик", icon: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 5H6L8 16H17L19 8H7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="19" r="1.4" fill="currentColor"/><circle cx="16" cy="19" r="1.4" fill="currentColor"/></svg>' },
    { id: "bazar", label: "Базар", icon: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M5 8L17 4V14L5 18V8Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="14" cy="10" r="1" fill="currentColor"/></svg>' },
  ];
  const cnt = selectedCount();
  return `
    <div class="tabbar">
      ${items
        .map(
          (it) => `
        <div class="tabbar__item ${active === it.id ? "tabbar__item--active" : ""}">
          <div class="tabbar__icon">
            ${it.icon}
            ${it.id === "cart" && cnt > 0 ? `<span class="tabbar__badge">${cnt}</span>` : ""}
          </div>
          <span>${it.label}</span>
        </div>`
        )
        .join("")}
    </div>`;
}

function productImage(key) {
  return PRODUCT_IMAGES[key] || "";
}

/* ====== navigation ====== */

document.addEventListener("click", (e) => {
  const back = e.target.closest('[data-action="back"]');
  if (back) {
    e.preventDefault();
    if (window.history.length > 1) history.back();
    else location.href = "index.html";
  }
});

/* ====== toast ====== */

function toast(msg) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.dataset.open = "true";
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    el.dataset.open = "false";
  }, 1800);
}
