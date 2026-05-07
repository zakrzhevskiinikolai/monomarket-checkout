/* ====== shared state ====== */

const STORAGE_KEY = "monomarket_prototype_v3";

const DEFAULT_STATE = {
  products: [
    {
      id: "ps5",
      name: "Ігрова консоль Sony PlayStation 5 Pro",
      seller: "Фокстрот",
      sellerAvatar: "assets/icons/seller_foxtrot.png",
      price: 24999,
      oldPrice: null,
      qty: 1,
      selected: false,
      installments: 8,
      image: "assets/products/ps5.png",
    },
    {
      id: "iphone17",
      name: "Смартфон Apple iPhone 17 Pro Max 512",
      seller: "КТС",
      sellerAvatar: "assets/icons/seller_ktc.png",
      price: 31199,
      oldPrice: 44999,
      qty: 2,
      selected: true,
      installments: 12,
      image: "assets/products/iphone17.png",
    },
    {
      id: "asus-tuf",
      name: "Ноутбук ігровий Asus TUF",
      seller: "Розетка",
      sellerAvatar: "assets/icons/seller_foxtrot.png",
      price: 31992,
      oldPrice: null,
      qty: 1,
      selected: false,
      installments: 8,
      image: "assets/products/laptop_tuf.png",
    },
    {
      id: "mx-master",
      name: "Миша Logitech MX Master 3S",
      seller: "Розетка",
      sellerAvatar: "assets/icons/seller_foxtrot.png",
      price: 3192,
      oldPrice: null,
      qty: 1,
      selected: false,
      installments: 12,
      image: "assets/products/mouse_logitech.png",
    },
  ],
  payment: "full",
  delivery: "courier",
  addresses: [
    { id: "a1", street: "вул. Старокозацька, 62А", apt: "12 пов", city: "м. Дніпро", note: "Безкоштовно у квартиру" },
    { id: "a2", street: "вул. Пироговський шлях, 136", city: "м. Одеса", note: "До дверей" },
  ],
  selectedAddressId: "a1",
  departments: [
    { id: "d1", number: "27", street: "вул. Пироговський шлях, 136", city: "м. Одеса", weight: "до 30 кг", icon: "box", recent: true },
    { id: "d2", number: "28277", street: "вул. Федорова, 32 (м. Олімпійська)", city: "м. Одеса", weight: "до 20 кг", icon: "postmat", isPostmat: true, recent: true },
    { id: "d3", number: "1", street: "Київське шосе, 27", city: "м. Одеса", weight: "до 1100 кг", icon: "truck" },
    { id: "d4", number: "2", street: "вул. Базова, 16", city: "м. Одеса", weight: "до 1100 кг", icon: "truck" },
    { id: "d5", number: "3", street: "вул. Дальницька, 23/4", city: "м. Одеса", weight: "до 30 кг", icon: "box" },
    { id: "d6", number: "4", street: "вул. Федорова, 32 (м. Олімпійська)", city: "м. Одеса", weight: "до 20 кг", icon: "box" },
  ],
  selectedDepartmentId: "d1",
  recipients: [
    { id: "r1", name: "Микола Новіков", phone: "+380 (95) 123 45 67", avatar: "photo" },
    { id: "r2", name: "Жанна Новікова", phone: "+380 (95) 123 45 67", avatar: "orange", initials: "ЖН" },
    { id: "r3", name: "Макс Жданов", phone: "+380 (95) 123 45 67", avatar: "purple", initials: "МЖ" },
  ],
  selectedRecipientId: "r1",
  card: "black",
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch (e) {}
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}
function saveState(s) { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }
let state = loadState();

/* ====== helpers ====== */

function fmtSum(n) {
  return Math.round(n).toLocaleString("uk-UA").replace(/,/g, " ") + " ₴";
}
function fmtNumber(n) {
  return Math.round(n).toLocaleString("uk-UA").replace(/,/g, " ");
}

function selectedProducts() { return state.products.filter((p) => p.selected); }
function cartTotal() { return selectedProducts().reduce((s, p) => s + p.price * p.qty, 0); }
function selectedQtyCount() { return selectedProducts().reduce((s, p) => s + p.qty, 0); }
function selectedItemCount() { return selectedProducts().length; }
function firstInstallment() {
  return selectedProducts().reduce((s, p) => s + Math.round((p.price * p.qty) / p.installments), 0);
}
function getSelectedAddress() { return state.addresses.find((a) => a.id === state.selectedAddressId); }
function getSelectedDepartment() { return state.departments.find((d) => d.id === state.selectedDepartmentId); }
function getSelectedRecipient() { return state.recipients.find((r) => r.id === state.selectedRecipientId); }

function plural(n, one, few, many) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

/* ====== inline icons (small SVG snippets) ====== */

const ICONS = {
  arrow_back: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 5L8 12L15 19" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  share: `<img src="assets/icons/share.svg" alt="" style="width:24px;height:24px;display:block">`,
  paw: `<img src="assets/icons/paw.svg" alt="" style="width:20px;height:20px;display:block">`,
  delete: `<img src="assets/icons/delete.svg" alt="" style="width:16px;height:16px;display:block">`,
  plus: `<img src="assets/icons/plus.svg" alt="" style="width:14px;height:14px;display:block">`,
  minus: `<img src="assets/icons/minus.svg" alt="" style="width:14px;height:14px;display:block">`,
  cart_white: `<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M0.6 1H1.7L2.6 7.1H8L8.8 3H2" stroke="white" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"/><circle cx="3.4" cy="8.6" r="0.7" fill="white"/><circle cx="6.7" cy="8.6" r="0.7" fill="white"/></svg>`,
  pencil: `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 1.2L10.8 4 4 10.8H1.2V8L8 1.2Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" fill="none"/></svg>`,
  chevron_right: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 5L13 10L8 15" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  search: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.6"/><path d="M12.2 12.2L15.5 15.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  np: `<svg width="18" height="18" viewBox="0 0 22 22" fill="none"><path d="M11 4V18M4 11H18M14 7L18 11L14 15M8 7L4 11L8 15" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  info: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.4"/><path d="M8 7V11M8 5V5.1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  mc_logo: `<svg width="16" height="10" viewBox="0 0 16 10" fill="none"><circle cx="6" cy="5" r="5" fill="#EB001B"/><circle cx="10" cy="5" r="5" fill="#F79E1B" fill-opacity="0.85"/><path d="M8 1.5C8.9 2.4 9.5 3.6 9.5 5C9.5 6.4 8.9 7.6 8 8.5C7.1 7.6 6.5 6.4 6.5 5C6.5 3.6 7.1 2.4 8 1.5Z" fill="#FF5F00"/></svg>`,
  visa_logo: `<svg width="20" height="8" viewBox="0 0 20 8" fill="none"><text x="0" y="7" font-family="-apple-system,sans-serif" font-size="7" font-weight="900" fill="#1A1F71" font-style="italic">VISA</text></svg>`,
  signal: `<svg width="17" height="11" viewBox="0 0 17 11" fill="none"><rect x="0" y="7.5" width="3" height="3.5" rx="0.6" fill="currentColor"/><rect x="4.5" y="5.5" width="3" height="5.5" rx="0.6" fill="currentColor"/><rect x="9" y="3" width="3" height="8" rx="0.6" fill="currentColor"/><rect x="13.5" y="0" width="3" height="11" rx="0.6" fill="currentColor"/></svg>`,
  wifi: `<svg width="15" height="11" viewBox="0 0 15 11" fill="none"><path d="M7.5 11C8.05 11 8.5 10.55 8.5 10C8.5 9.45 8.05 9 7.5 9C6.95 9 6.5 9.45 6.5 10C6.5 10.55 6.95 11 7.5 11Z" fill="currentColor"/><path d="M3.5 6.7C4.6 5.6 6 5 7.5 5C9 5 10.4 5.6 11.5 6.7L12.6 5.7C11.2 4.4 9.4 3.6 7.5 3.6C5.6 3.6 3.8 4.4 2.4 5.7L3.5 6.7Z" fill="currentColor"/><path d="M0.7 4C2.6 2.2 5 1 7.5 1C10 1 12.4 2.2 14.3 4L15.5 2.9C13.4 0.8 10.6 -0.4 7.5 -0.4C4.4 -0.4 1.6 0.8 -0.5 2.9L0.7 4Z" fill="currentColor"/></svg>`,
  battery: `<svg width="25" height="11" viewBox="0 0 25 11" fill="none"><rect x="0.5" y="0.5" width="22" height="10" rx="2.5" stroke="currentColor"/><rect x="2" y="2" width="19" height="7" rx="1.3" fill="currentColor"/><rect x="23" y="3.5" width="1.5" height="4" rx="0.8" fill="currentColor"/></svg>`,
};

/* ====== layout helpers ====== */

function statusBar() {
  return `
    <div class="statusbar">
      <div class="statusbar__time">19:12</div>
      <div class="statusbar__icons">${ICONS.signal}${ICONS.wifi}${ICONS.battery}</div>
    </div>`;
}

function tabbar(active = "cart") {
  const cnt = selectedQtyCount();
  return `
    <div class="tabbar">
      <div class="tabbar__pill tabbar__pill--single">
        <div class="tabbar__item ${active === "bank" ? "tabbar__item--active" : ""}">
          <div class="tabbar__icon"><img src="assets/icons/bank.svg" alt=""></div>
          <span class="tabbar__label">Банк</span>
        </div>
      </div>
      <div class="tabbar__pill">
        <div class="tabbar__item ${active === "main" ? "tabbar__item--active" : ""}">
          <div class="tabbar__icon"><img src="assets/icons/market.svg" alt=""></div>
          <span class="tabbar__label">Головна</span>
        </div>
        <div class="tabbar__item ${active === "cabinet" ? "tabbar__item--active" : ""}">
          <div class="tabbar__icon"><img src="assets/icons/cabinet.svg" alt=""></div>
          <span class="tabbar__label">Кабінет</span>
        </div>
        <div class="tabbar__item ${active === "cart" ? "tabbar__item--active" : ""}">
          <div class="tabbar__icon">
            <img src="assets/icons/cart_tab.svg" alt="">
            ${cnt > 0 ? `<span class="tabbar__badge">${cnt}</span>` : ""}
          </div>
          <span class="tabbar__label">Кошик</span>
        </div>
      </div>
      <div class="tabbar__pill tabbar__pill--single">
        <div class="tabbar__item ${active === "bazar" ? "tabbar__item--active" : ""}">
          <div class="tabbar__icon"><img src="assets/icons/bazar.svg" alt=""></div>
          <span class="tabbar__label">Базар</span>
        </div>
      </div>
    </div>`;
}

/* ====== navigation & toast ====== */

document.addEventListener("click", (e) => {
  const back = e.target.closest('[data-action="back"]');
  if (back) {
    e.preventDefault();
    if (window.history.length > 1) history.back();
    else location.href = "index.html";
  }
});

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
  window.__toastTimer = setTimeout(() => (el.dataset.open = "false"), 1800);
}
