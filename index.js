///////////// JS CODE FOR PRODUCTS.HTML ///////////

function jumpToProducts(btn) {
  const occ = encodeURIComponent(btn.dataset.occ);
  window.location.href = `products.html?occ=${occ}`;
}

document.addEventListener("DOMContentLoaded", function () {

  // 1) Grab references to all <select> elements
  const occasionSelect = document.getElementById("occasion-select");
  if (!occasionSelect) return;

  const params = new URLSearchParams(location.search);
  const occParam = params.get("occ");

  if (occParam) {
    // first try a direct value match …
    if ([...occasionSelect.options].some(o => o.value === occParam)) {
      occasionSelect.value = occParam;
    } else {
      // … otherwise match on the visible option text
      const match = [...occasionSelect.options]
        .find(o => o.textContent.trim() === occParam);
      if (match) occasionSelect.value = match.value;
    }
  }

  const priceSelect = document.getElementById("price-select");
  const sizeSelect = document.getElementById("size-select");
  const flowerSelect = document.getElementById("flower-select");
  const colorSelect = document.getElementById("color-select");
  const resetFiltersBtn = document.querySelector(".reset-filters-btn");

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", resetFilters);
  }

  // 2) References for the scroll-to-top card / button / text  // NEW
  const scrollTopDiv = document.querySelector(".scroll-top-div");        // whole card
  const scrollTopBtn = scrollTopDiv.querySelector(".scroll-top-btn");    // button
  const scrollTopTxt = scrollTopDiv.querySelector(".scroll-top-txt");    // span

  // 3) Whenever any dropdown changes, re-run the filter
  [occasionSelect, priceSelect, sizeSelect, flowerSelect, colorSelect]
    .forEach(sel => sel.addEventListener("change", filterProducts));


  // 4) Main filtering function
  function filterProducts() {

    // ----- read the current selections ---------------------------------------
    const selectedOccasion = occasionSelect.value;
    const selectedPrice = priceSelect.value;
    const selectedSize = sizeSelect.value;
    const selectedFlower = flowerSelect.value;
    const selectedColor = colorSelect.value;

    // price range parsing (if any)
    let priceMin = null, priceMax = null;
    if (selectedPrice.includes("-")) {
      const parts = selectedPrice.split("-").map(x => parseFloat(x));
      priceMin = parts[0];
      priceMax = parts[1];
    }

    // -------------------------------------------------------------------------
    // a) *** Grab ONLY the real product cards (skip the scroll-top card) ***  // NEW
    const productSelector = ".product-card:not(.scroll-top-div)";
    const allCards = document.querySelectorAll(productSelector);

    // b) ----- sort by price if requested -------------------------------------
    if (selectedPrice === "low-high" || selectedPrice === "high-low") {
      const cardArray = Array.from(allCards);
      cardArray.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);
        return selectedPrice === "low-high" ? priceA - priceB : priceB - priceA;
      });

      const container = document.querySelector(".products-div");
      cardArray.forEach(c => container.appendChild(c));
    }

    // c) ----- apply the rest of the filters ----------------------------------
    let visibleCount = 0;                                            // NEW
    allCards.forEach(card => {
      const cardOccasion = card.dataset.occasion;
      const cardPrice = parseFloat(card.dataset.price);
      const cardSize = card.dataset.size;
      const cardFlowers = card.dataset.flowers.split(",");
      const cardColors = card.dataset.colors.split(",");

      let isVisible = true;

      // occasion
      if (selectedOccasion && cardOccasion !== selectedOccasion) isVisible = false;
      // size
      if (isVisible && selectedSize && cardSize !== selectedSize) isVisible = false;
      // flower
      if (isVisible && selectedFlower && !cardFlowers.includes(selectedFlower)) isVisible = false;
      // colour
      if (isVisible && selectedColor && !cardColors.includes(selectedColor)) isVisible = false;
      // price range
      if (isVisible && priceMin !== null && priceMax !== null) {
        if (isNaN(cardPrice) || cardPrice < priceMin || cardPrice > priceMax) isVisible = false;
      }

      // show / hide card
      card.style.display = isVisible ? "" : "none";
      if (isVisible) visibleCount++;                                 // NEW
    });

    // d) ----- update scroll-to-top card according to visibleCount ----------- // NEW
    updateScrollTopCard(visibleCount);

    // e) ----- always keep scroll-top card at the very end ------------------- // NEW
    document.querySelector(".products-div").appendChild(scrollTopDiv);
  }

  // 5) Helper that shows / hides / disables the scroll-top card  // NEW
  function updateScrollTopCard(count) {
    if (count === 0) {
      // show card, disable button, change text
      scrollTopDiv.style.display = "";
      scrollTopBtn.disabled = true;
      scrollTopBtn.style.pointerEvents = "none";
      scrollTopTxt.textContent = "No bouquets for Current Filters";
    } else if (count > 0 && count <= 6) {
      // hide card completely
      scrollTopDiv.style.display = "none";
    } else { // count > 6
      // show & enable card with normal text
      scrollTopDiv.style.display = "";
      scrollTopBtn.disabled = false;
      scrollTopBtn.style.pointerEvents = "";
      scrollTopTxt.textContent = "SCROLL TO TOP";
    }
  }

  // Clears every filter back to its default and reapplies the product filter
  function resetFilters() {
    // Put each <select> back on its first (“no choice”) option
    [occasionSelect, priceSelect, sizeSelect, flowerSelect, colorSelect]
      .forEach(sel => sel.selectedIndex = 0);       // assumes option 0 has value=""

    filterProducts();                               // redraw list & scroll-top card
  }
  // 6) Run once on page-load so default selections take effect
  filterProducts();
});

(() => {
  const landingURL = 'landing.html';     // adjust to your actual path

  // Event delegation: one listener for every .go-to-landing button
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.go-to-landing');
    if (!btn) return;                    // not our button

    e.preventDefault();                  // stop any inline href/onclick
    const card = btn.closest('.product-card');
    if (!card) return;

    // Pull the bits we need
    const bouquet = {
      name: card.querySelector('.bouquet-name').textContent.trim(),
      price: card.querySelector('.bouquet-price').textContent.trim(),
      img: card.querySelector('.product-img').getAttribute('src')
    };

    sessionStorage.setItem('selectedBouquet', JSON.stringify(bouquet));
    window.location.href = landingURL;
  });
})();

//////////////////////////////////////////////////
// ############################################ //
///////////// JS CODE FOR LOGIN.HTML /////////////

// THIS FUNCTION DEALS WITH CHANGING LOGIN FORMS ON login.html
document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.querySelector('.login-selected');
  const signupBtn = document.querySelector('.signup-selected');
  const current = document.querySelector('.current-form');

  // --- your two form templates ---
  const loginFormHTML = `
    <form action="index.html" method="post" class="both-forms">
      <div class="form-group">
        <label for="username">USERNAME:</label>
        <input type="text" id="username" name="username" placeholder="Enter Username here…" required>
      </div>
      <div class="form-group">
        <label for="password">PASSWORD:</label>
        <input type="password" id="password" name="password" placeholder="Enter Password here…" required>
      </div>
      <button type="submit">LOG IN</button>
    </form>
    <a href="index.html" class="password-forgot">Forgot your password?</a>
  `;

  const signupFormHTML = `
    <form action="index.html" method="post" class="both-forms">
      <div class="form-group">
        <label for="new-username">USERNAME:</label>
        <input type="text" id="new-username" name="username" placeholder="Choose a username…" required>
      </div>
      <div class="form-group">
        <label for="email">EMAIL:</label>
        <input type="email" id="email" name="email" placeholder="Enter your email…" required>
      </div>
      <div class="form-group">
        <label for="new-password">PASSWORD:</label>
        <input type="password" id="new-password" name="password" placeholder="Create a password…" required>
      </div>
      <div class="form-group">
        <label for="confirm-password">CONFIRM:</label>
        <input type="password" id="confirm-password" name="confirmPassword" placeholder="Repeat password…" required>
      </div>
      <button type="submit">SIGN UP</button>
    </form>
  `;

  // --- shared style presets ---
  const selectedStyle = { border: '0.25rem solid black', background: 'black', color: 'white', cursor: 'not-allowed' };
  const unselectedStyle = { border: '0.25rem solid white', background: 'white', color: 'black', cursor: 'pointer' };

  function applyStyles(el, styles) {
    Object.keys(styles).forEach(prop => {
      el.style[prop] = styles[prop];
    });
  }

  function showLogin() {
    current.innerHTML = loginFormHTML;
    applyStyles(loginBtn, selectedStyle);
    applyStyles(signupBtn, unselectedStyle);
  }

  function showSignup() {
    current.innerHTML = signupFormHTML;
    applyStyles(signupBtn, selectedStyle);
    applyStyles(loginBtn, unselectedStyle);
  }

  // initial state: assume signup is selected
  showLogin();

  loginBtn.addEventListener('click', showLogin);
  signupBtn.addEventListener('click', showSignup);
});

//////////////////////////////////////////////////
// ############################################ //
///////////// JS CODE FOR LOOK.HTML //////////////

// THIS FUNCTION DEALS WITH CHANGING THE LIGHT AND 
// THE ROOM (body) BACKGROUND
document.addEventListener('DOMContentLoaded', () => {
  const leftBtn = document.querySelector('.light-left');
  const rightBtn = document.querySelector('.light-right');
  const lampImg = document.querySelector('.lamp-img');

  const LAMPS = [
    'white-lamp',
    'red-lamp',
    'yellow-lamp',
    'orange-lamp',
    'blue-lamp'
  ];
  const getColor = lamp => lamp.split('-')[0];

  // figure out starting index
  const initialMatch = lampImg.src.match(/\/([^\/]+)\.png$/);
  let currentIndex = initialMatch
    ? LAMPS.indexOf(initialMatch[1])
    : 0;

  function updateDisplay() {
    lampImg.style.opacity = 0;
    setTimeout(() => {
      const lampName = LAMPS[currentIndex];
      const color = getColor(lampName);

      lampImg.src = `images/lights/${lampName}.png`;
      document.body.style.background =
        `url("images/wallpapers/room-${color}.png") center/cover no-repeat`;

      lampImg.style.opacity = 1;
    }, 1000); // match the CSS duration here
  }

  leftBtn.addEventListener('click', () => {
    currentIndex = (currentIndex <= 0)
      ? LAMPS.length - 1
      : currentIndex - 1;
    updateDisplay();
  });

  rightBtn.addEventListener('click', () => {
    currentIndex = (currentIndex >= LAMPS.length - 1)
      ? 0
      : currentIndex + 1;
    updateDisplay();
  });
});

// THIS FUNCTION DEALS WITH CHANGING THE BOUQUETS.
document.addEventListener('DOMContentLoaded', () => {
  const leftBtn   = document.querySelector('.bouquet-left');
  const rightBtn  = document.querySelector('.bouquet-right');
  const bouquetImg = document.querySelector('.bouquet-img');

  const TOTAL = 25; // b1 … b25
  const stored = parseInt(sessionStorage.getItem('lookBouquetIdx'), 10);

  /* starting index: value from landing.html  →  fallback to img src → 1 */
  let current = (stored >= 1 && stored <= TOTAL)
      ? stored
      : (bouquetImg.src.match(/b(\d+)\.png$/) || [,1])[1];

  current = parseInt(current, 10) || 1;
  bouquetImg.src = `images/bouquets/b${current}.png`; 

  /* nice little fade when switching (optional) */
  const swap = () => {
    bouquetImg.style.opacity = 0;
    setTimeout(() => {
      bouquetImg.src = `images/bouquets/b${current}.png`;
      bouquetImg.style.opacity = 1;
    }, 500);
  };

  leftBtn .addEventListener('click', () => {
    current = current <= 1 ? TOTAL : current - 1;
    swap();
  });

  rightBtn.addEventListener('click', () => {
    current = current >= TOTAL ? 1 : current + 1;
    swap();
  });

  /* one-time use; tidy up */
  sessionStorage.removeItem('lookBouquetIdx');
});

// THIS FUNCTION DEALS WITH CHANGING THE TABLES.
document.addEventListener('DOMContentLoaded', () => {
  // Button and image element references
  const tableLeftBtn = document.querySelector('.table-left');
  const tableRightBtn = document.querySelector('.table-right');
  const tableImg = document.querySelector('.table-img');

  // List of table filenames (without extension)
  const TABLES = [
    'table1',
    'table2',
    'table3',
    'table4',
    'table5'
  ];

  // Determine the initially displayed table index
  const srcMatch = tableImg.getAttribute('src').match(/\/([^\/]+)\.png$/);
  let currentTableIndex = srcMatch
    ? TABLES.indexOf(srcMatch[1])
    : 0;
  if (currentTableIndex === -1) currentTableIndex = 0;

  // Function to update the displayed table image
  const updateTableImage = () => {
    tableImg.src = `images/tables/${TABLES[currentTableIndex]}.png`;
  };

  // Left-arrow: previous table (wrap to last)
  tableLeftBtn.addEventListener('click', () => {
    currentTableIndex = (currentTableIndex <= 0)
      ? TABLES.length - 1
      : currentTableIndex - 1;
    updateTableImage();
  });

  // Right-arrow: next table (wrap to first)
  tableRightBtn.addEventListener('click', () => {
    currentTableIndex = (currentTableIndex >= TABLES.length - 1)
      ? 0
      : currentTableIndex + 1;
    updateTableImage();
  });
});

///////////////////////////////////////////////////////
// ################################################# //
///////////// JS CODE FOR CUSTOMIZE.HTML //////////////

const VASE_BTN = "vase-btn-";   // vase button class prefix
const ADD_BTN = "add-";        // flower add button class prefix
const MINUS_BTN = "minus-";      // flower minus button class prefix

const VASE_IMG_DIR = "images/pots/pot";       // + n + .png
const FLOWER_IMG_DIR = "images/flowers/flower"; // + n + .png
const ICON_ADD = "images/buttons/add.png";
const ICON_TICK = "images/buttons/tick.png";

const MAX_FLOWERS = 30;

/* ---------- STATE ---------- */
let currentVase = 0;  // start none, then programmatically select #1
let orderCounter = 0;  // for stacking flowers

/* ---------- GRID ---------------- */
const rowBottoms = [0, 60, 120, 180, 210, 250];
const colLefts = [50, 30, 70, 10, 90];
const colAngles = [0, -30, 30, -45, 45];

const currentFlowers = rowBottoms.flatMap(b =>
  colLefts.map((l, idx) => ({
    flower_num: -1,
    bottom: `${b}%`,
    left: `${l}%`,
    angle: colAngles[idx],
    order: null
  }))
);

/* ---------- HELPERS ---------- */
const $ = sel => document.querySelector(sel);
const btn = (p, n) => document.querySelector(`.${p}${n}`);

function setBtnImg(button, src) {
  const img = button?.querySelector(".scroll-btn-img");
  if (img) img.src = src;
}

/* ---------- COUNTER ---------- */
function updateFlowerCounter() {
  const count = currentFlowers.filter(c => c.flower_num !== -1).length;
  const counterDiv = $(".counter-div");
  if (counterDiv) counterDiv.textContent = `MAX FLOWERS: ${MAX_FLOWERS} | YOU ADDED: ${count}`;
}

/* ---------- VASE HANDLERS ---------- */
function initVaseButtons() {
  for (let n = 1; n <= 8; n++) {
    btn(VASE_BTN, n)?.addEventListener("click", () => selectVase(n));
  }
}

function selectVase(n) {
  if (currentVase === n) return;

  /* ―――― restore previous button ―――― */
  const prevBtn = btn(VASE_BTN, currentVase);
  if (prevBtn) {
    prevBtn.disabled = false;
    setBtnImg(prevBtn, ICON_ADD);

    // bring back normal hover & background
    prevBtn.classList.add("hoverEffect");
    prevBtn.classList.remove("selected-vase");
  }

  /* ―――― select new vase ―――― */
  currentVase = n;
  $(".tool-vase-img-div").innerHTML =
    `<img src="${VASE_IMG_DIR}${n}.png" class="tool-vase-img" style="z-index:${n === 1 ? 997 : 999}">`;

  const curBtn = btn(VASE_BTN, n);
  if (curBtn) {
    curBtn.disabled = true;
    setBtnImg(curBtn, ICON_TICK);

    // ❱❱ remove hover effects + darken background
    curBtn.classList.remove("hoverEffect");  // no hover on selected vase
    curBtn.classList.add("selected-vase");   // give it the dark style
  }
}

/* ---------- FLOWER HANDLERS ---------- */
function initFlowerButtons() {
  for (let n = 1; n <= 10; n++) {
    btn(ADD_BTN, n)?.addEventListener("click", () => addFlower(n));
    btn(MINUS_BTN, n)?.addEventListener("click", () => removeFlower(n));
  }
}

function addFlower(num) {
  const slot = currentFlowers.find(c => c.flower_num === -1);
  if (!slot) return; // grid full
  slot.flower_num = num;
  slot.order = ++orderCounter;
  renderFlowers();
}

function removeFlower(num) {
  for (let i = currentFlowers.length - 1; i >= 0; i--) {
    if (currentFlowers[i].flower_num === num) {
      currentFlowers[i].flower_num = -1;
      currentFlowers[i].order = null;
      compressFlowers();
      renderFlowers();
      return;
    }
  }
}

function compressFlowers() {
  const filled = currentFlowers.filter(c => c.flower_num !== -1);
  currentFlowers.forEach((cell, i) => {
    if (i < filled.length) {
      cell.flower_num = filled[i].flower_num;
      cell.order = filled[i].order;
    } else {
      cell.flower_num = -1;
      cell.order = null;
    }
  });
}

function renderFlowers() {
  const container = $(".flower-container");
  container.innerHTML = "";

  const active = currentFlowers.filter(c => c.flower_num !== -1);
  const maxOrder = active.length ? Math.max(...active.map(c => c.order)) : 0;

  // older flowers on top
  active.sort((a, b) => b.order - a.order);

  active.forEach(cell => {
    const img = document.createElement("img");
    img.className = "tool-flower-img";
    img.src = `${FLOWER_IMG_DIR}${cell.flower_num}.png`;
    img.style.position = "absolute";
    img.style.bottom = cell.bottom;
    img.style.left = cell.left;
    img.style.transform = `translateX(-50%) rotate(${cell.angle}deg)`;
    img.style.zIndex = String(maxOrder - cell.order + 1);
    container.appendChild(img);
  });

  updateFlowerCounter();
}

/* ---------- INITIALIZE ---------- */
window.addEventListener("DOMContentLoaded", () => {
  initVaseButtons();
  initFlowerButtons();
  selectVase(1);        // default vase given as the wrapper
  renderFlowers();
  updateFlowerCounter();
});

///////////////////////////////////////////////////////
// ################################################# //
///////////// JS CODE FOR LANDING.HTML ///////////
const backBtn = document.getElementById('back-btn');

backBtn.addEventListener('click', () => {
  /*
    history.length > 1 ⇒ the user has something to go back to.
    If this is the first page in the tab, fall back to a safe URL
    (home, products list, etc.).
  */
  if (window.history.length > 1) {
    window.history.back();        // or: window.history.go(-1);
  } else {
    window.location.href = '/';   // ←- your own fallback start page
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const raw = sessionStorage.getItem('selectedBouquet');
  if (!raw) return;                      // user landed directly; keep defaults

  const { name, price, img } = JSON.parse(raw);

  // Inject into the markup you showed
  document.querySelector('.b-title .bouquet-name').textContent = name;
  document.querySelector('.b-price  .price-text').textContent = price;

  const imgEl = document.querySelector('.b-img .bouquet-image');
  imgEl.src = img;
  imgEl.alt = `${name} Image`;

  // (Optional) clean up so a page refresh doesn't overwrite manual edits
  // sessionStorage.removeItem('selectedBouquet');
});
