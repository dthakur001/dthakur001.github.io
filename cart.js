(() => {
    /* ---------- CONFIG ---------- */
    const LS_KEY = 'flowerCart';        // where the cart lives in localStorage
    const TAX_RATE = 0.12;              // 7 % GST + 5 % HST  = 12 %

    /* ---------- HELPERS ---------- */
    const $ = sel => document.querySelector(sel);
    const $$ = sel => [...document.querySelectorAll(sel)];
    const money = n => `$${n.toFixed(2)}`;

    function loadCart() { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
    function saveCart(cart) { localStorage.setItem(LS_KEY, JSON.stringify(cart)); }
    function clearCart() { localStorage.removeItem(LS_KEY); }

    function cartClickHandler(e) {
        const card = e.target.closest('.cart-product-card');
        if (!card) return;
        const id = card.dataset.id;

        if (e.target.closest('.add-bqt')) changeQty(id, +1);
        if (e.target.closest('.minus-bqt')) changeQty(id, -1);
        if (e.target.closest('.remove-bqt')) pullItem(id);

        renderCheckout();          // redraw after the change
    }

    /* ---------- CORE API ---------- */

    /* ---------- NAV-BAR CART BADGE & LINK ---------- */
    function updateBadge() {
        /* how many items in the entire cart? */
        const qty = loadCart().reduce((s, l) => s + l.qty, 0);
        document.querySelectorAll('.cart-count').forEach(el => el.textContent = qty);
    }

    /* click → checkout */
    function hookNavBtn() {
        const btn = document.querySelector('.cart-button');
        if (btn) btn.addEventListener('click', () => (window.location.href = 'checkout.html'));
    }

    /* call the badge updater every time the cart changes */
    const _save = saveCart; saveCart = c => { _save(c); updateBadge(); };
    const _clear = clearCart; clearCart = () => { _clear(); updateBadge(); };

    /* also refresh on first paint */
    document.addEventListener('DOMContentLoaded', () => {
        updateBadge();
        hookNavBtn();
    });

    function addItem({ id, name, price, img, qty = 1 }) {
        const cart = loadCart();
        const line = cart.find(l => l.id === id);
        line ? (line.qty += qty) : cart.push({ id, name, price, img, qty });
        saveCart(cart);
    }

    function changeQty(id, delta) {
        const cart = loadCart();
        const line = cart.find(l => l.id === id);
        if (!line) return;
        line.qty += delta;
        if (line.qty <= 0)          // 0  → remove
            pullItem(id);
        else
            saveCart(cart);
    }

    function pullItem(id) {
        const cart = loadCart().filter(l => l.id !== id);
        saveCart(cart);
    }

    function totals() {
        const sub = loadCart().reduce((s, l) => s + l.price * l.qty, 0);
        const tax = sub * TAX_RATE;
        return { sub, tax, grand: sub + tax };
    }

    function renderCheckout() {
        const wrap = document.querySelector('.cart-items-container');
        if (!wrap) return;

        /* ---------- build the rows ---------- */
        const cart = loadCart();
        wrap.innerHTML = '';

        cart.forEach(({ id, name, price, img, qty }) => {
            wrap.insertAdjacentHTML('beforeend', `
    <div class="cart-product-card" data-id="${id}">
        <img  class="cart-bqt-img" src="${img}">
        <span class="cart-bqt-name">${name}</span>
        <span class="cart-bqt-total">${money(price)} × ${qty} = ${money(price * qty)}</span>

        <div class="cart-bqt-btns">
            <button class="cart-btn add-bqt">
                <img class="cart-add-img"   src="images/buttons/add.png"    alt="+">
            </button>
            <button class="cart-btn minus-bqt">
                <img class="cart-minus-img" src="images/buttons/minus.png"  alt="-">
            </button>
            <button class="cart-btn remove-bqt">
                <img class="cart-delete-img" src="images/buttons/delete.png" alt="×">
            </button>
        </div>
    </div>`);
        });

        /* ---------- grand total (includes 12 % tax) ---------- */
        document.querySelector('.total-sales').textContent = money(totals().grand);
    }


    /* ---------- “PAY NOW” hook (checkout.html) ---------- */
    function watchPayment() {
        const payBtn = $('.pay-btn');
        if (!payBtn) return;

        payBtn.addEventListener('click', () => {
            clearCart();           // zap cart
            // your existing success popup / redirect already runs
        });
    }

    /* ---------- GLOBAL INITIALISATION ---------- */
    document.addEventListener('DOMContentLoaded', () => {
        /* hook the container once */
        const wrap = document.querySelector('.cart-items-container');
        if (wrap) wrap.addEventListener('click', cartClickHandler);

        renderCheckout();   // first paint
        watchPayment();     // existing pay-button hook
    });


    /* ---------- EXPORT mini-API for other pages ---------- */
    window.FlowerCart = { addItem };     // we only need a single public call
})();
