AOS.init({
  offset: '140', // 50% viewport height ka offset
});
document.addEventListener("DOMContentLoaded", function() {
  const loader = document.querySelector('.loader');
  setTimeout(() => {
    loader.style.opacity = '0';
    loader.style.display = 'none';
  }, 3000);
});

// Header functionality
var getHamburgerIcon = document.getElementById("hamburger");
var getHamburgerCrossIcon = document.getElementById("hamburger-cross");
var getMobileMenu = document.getElementById("mobile-menu");

// Open the mobile menu
getHamburgerIcon.addEventListener("click", function () {
    getMobileMenu.style.transform = "translateX(0%)";
});

// Close the mobile menu
function closeMenu() {
    getMobileMenu.style.transform = "translateX(-100%)";
}

// Close the mobile menu when the close icon is clicked
getHamburgerCrossIcon.addEventListener("click", closeMenu);

// Close the mobile menu if clicking outside of it
document.addEventListener("click", function(event) {
    var isClickInsideMenu = getMobileMenu.contains(event.target);
    var isClickOnIcon = getHamburgerIcon.contains(event.target);

    if (!isClickInsideMenu && !isClickOnIcon) {
        closeMenu();
    }
});

// Search bar functionality
const searchBtn = document.getElementById("searchBtn");
const searchBtnMobile = document.getElementById("searchBtnMobile");
const closeBtn = document.getElementById("search-close-btn");
const searchCon = document.getElementById("search-container");

// Show search container when search button is clicked
searchBtn.addEventListener("click", (event) => {
  event.preventDefault();
  searchCon.classList.remove("d-none");
  requestAnimationFrame(() => {
    searchCon.classList.add("show");
  });
});

// Show search container when mobile search button is clicked
searchBtnMobile.addEventListener("click", (event) => {
  event.preventDefault();
  searchCon.classList.remove("d-none");
  requestAnimationFrame(() => {
    searchCon.classList.add("show");
  });
});

// Hide search container when close button is clicked
closeBtn.addEventListener("click", () => {
  searchCon.classList.remove("show");
  setTimeout(() => {
    searchCon.classList.add("d-none");
  }, 500); // Delay hiding the search container to allow animation to complete
});


// Header scroll behavior
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const headerClass = document.querySelector('.header');

  const checkScroll = () => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
      headerClass.classList.remove('my-3');
      headerClass.classList.add('my-2');
      sessionStorage.setItem('scrolled', 'true');
      
    } else {
      header.classList.remove('scrolled');
      headerClass.classList.add('my-3');
      headerClass.classList.remove('my-2');
      sessionStorage.removeItem('scrolled');
    }
  };

  // Check scroll position on page load
  if (sessionStorage.getItem('scrolled') === 'true') {
    header.classList.add('scrolled');
  }
  window.addEventListener('scroll', checkScroll);  
  checkScroll(); // Initial check
});

// Slider initialization

// Our Menu Slider
$('#our-menus').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  fade: true,
  speed: 300,
  asNavFor: '.slider-indicators-wrapper',
  draggable: false,
  swipe: false,
});

// Navigation Slider for Our Menu
$('.slider-indicators-wrapper').slick({
  slidesToShow: 5,
  slidesToScroll: 1,
  asNavFor: '#our-menus',
  dots: false,
  arrows: true,
  focusOnSelect: true,
  draggable: false,
  swipe: false,
  prevArrow: '<button class="slide-arrow prev-arrow"><i class="fas fa-chevron-left"></i></button>',
  nextArrow: '<button class="slide-arrow next-arrow"><i class="fas fa-chevron-right"></i></button>',
  responsive: [
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 5,
      }
    },
    {
      breakpoint: 990,
      settings: {
        slidesToShow: 1,
        arrows: true,
      }
    }
  ]
});

// Custom animation for Our Menu slider
$('#our-menus').on('beforeChange', function(event, slick, currentSlide, nextSlide) {
  var $nextSlide = $(slick.$slides[nextSlide]);
  var $currentSlide = $(slick.$slides[currentSlide]);

  // Set initial state for the next slide
  $nextSlide.css({
    'transform': 'translateY(10%)',
    'opacity': 0,
  });

  // Animate the next slide into view after a short delay
  setTimeout(function() {
    $nextSlide.css({
      'transform': 'translateY(0)',
      'opacity': 1,
      'transition': 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out'
    });
  }, 50); 
});

// Testimonials Slider
$('.testimonials .slider-content').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  fade: false,
  speed: 300,
  asNavFor: '.testimonials .slider-nav',
  draggable: true,
  swipe: true,
});

// Navigation Slider for Testimonials
$('.testimonials .slider-nav').slick({
  slidesToShow: 3,
  slidesToScroll: 1,
  asNavFor: '.testimonials .slider-content',
  dots: false,
  focusOnSelect: true,
  centerMode: true, // Center the active slide
  centerPadding: '0px',
  draggable: true,
  swipe: true,
  arrows: false, // Disable navigation arrows
  infinite: true,
});




// Navigation Slider for Story
$('.story-indicators > .row').slick({
  slidesToShow: 6,
  slidesToScroll: 1,
  asNavFor: '.story-content',
  dots: false,
  focusOnSelect: true,
  centerPadding: '0px',
  draggable: true,
  swipe: true,
  arrows: false, // Disable navigation arrows
  infinite: true,
  prevArrow: '<button class="slide-arrow prev-arrow"><i class="fas fa-chevron-left"></i></button>',
  nextArrow: '<button class="slide-arrow next-arrow"><i class="fas fa-chevron-right"></i></button>',
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
      }
    }
  ]
});




$('.chef-choise-slider').slick({
  slidesToShow: 3,
  vertical: true,
  slidesToScroll: 1,
  arrows: false,
  fade: false,
  speed: 300,
  draggable: true,
  swipe: true,
  responsive: [
    {
      breakpoint: 786,
      settings: {
        slidesToShow: 2.2,
        slidesToScroll: 1,
      }
    }
  ]
});

// Add click events for the chevron icons
$('.chef-choise-icons .fa-chevron-up').on('click', function() {
  $('.chef-choise-slider').slick('slickPrev');
});

$('.chef-choise-icons .fa-chevron-down').on('click', function() {
  $('.chef-choise-slider').slick('slickNext');
});

// Update copyright year
document.getElementById('copyrightCurrentYear').textContent = new Date().getFullYear();


var shoppingbtn = document.getElementById('shoppingbutton');
var shoppingbtnMobile = document.getElementById('shoppingbuttonMobile');
var shoppingCart = document.querySelector('.shopping-cart');
var cartClose = document.querySelectorAll('.shopping-cart-header > i');

shoppingbtn.addEventListener('click', function(event) {
  event.preventDefault();
  console.log('chl');
  shoppingCart.style.right = "0";
});

shoppingbtnMobile.addEventListener('click', function(event) {
  event.preventDefault();
  console.log('chl');
  shoppingCart.style.right = "0";
});

cartClose.forEach(function(closeBtn) {
  closeBtn.addEventListener('click', function(event) {
    event.preventDefault();
    shoppingCart.style.right = "-100vw";
  });
});





// assets/js/script.js  (append/replace)
document.addEventListener('DOMContentLoaded', () => {
  loadAllCategories();
});

// fetch all dishes and render by category
async function loadAllCategories() {
  try {
    const res = await fetch('/api/dishes');
    const dishes = await res.json();
    // group by category
    const groups = {};
    dishes.forEach(d => {
      const cat = d.category;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(d);
    });

    // categories we expect (make sure these IDs exist in HTML)
    const categories = ['热菜','凉菜','汤品','主食','甜品','饮品','特别'];

    categories.forEach(cat => {
      const container = document.getElementById(`category-${cat}`);
      if (!container) return;
      const items = groups[cat] || [];
      container.innerHTML = items.map(renderDishCard).join('');
    });
  } catch (err) {
    console.error('Failed to load dishes', err);
  }
}

// HTML for a single dish (adjust styling to match your CSS)
function renderDishCard(d) {
  const image = d.image ? d.image : 'https://res.cloudinary.com/dhajpkcjc/image/upload/v1770945786/food_placeholder_lj4kwj.png';
  return `
    <div class="col-12 my-3">
      <div class="row align-items-center">
        <div class="col-lg-4">
          <img src="${image}" alt="${escapeHTML(d.name)}" style="max-width:100%;">
        </div>
        <div class="col-lg-8">
          <h5>${escapeHTML(d.name)}</h5>
          <p>${escapeHTML(d.description || '')}</p>
          <div class="d-flex justify-content-between align-items-center">
            <div class="item-btn"><a href="#" class="order-btn" data-id="${d._id}">Order</a></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function escapeHTML(s){ return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }









// dishes db connection dynamic showings

// ===== render all six categories (single fetch) =====
document.addEventListener('DOMContentLoaded', () => {
  renderAllMenuCategories();
});

async function renderAllMenuCategories() {
  const apiUrl = '/api/dishes';
  const fallback = 'https://res.cloudinary.com/dhajpkcjc/image/upload/v1770945786/food_placeholder_lj4kwj.png';

  // mapping: short id prefix -> Chinese category name
  const categories = [
    { key: 'hot', name: '热菜' },
    { key: 'cold', name: '凉菜' },
    { key: 'soup', name: '汤品' },
    { key: 'starch', name: '主食' },
    { key: 'dessert', name: '甜品' },
    { key: 'drink', name: '饮品' },
    { key: 'special', name: '特别' }
  ];

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      console.error('Failed to fetch dishes', res.status);
      showLoadErrorsForAll();
      return;
    }
    const dishes = await res.json();
    if (!Array.isArray(dishes)) {
      console.error('Invalid dishes payload', dishes);
      showLoadErrorsForAll();
      return;
    }

    // group by category
    const groups = dishes.reduce((acc, d) => {
      const cat = d.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(d);
      return acc;
    }, {});

    // render each category
    categories.forEach(cat => {
      const arr = groups[cat.name] || [];
      // sort by name
      arr.sort((a,b) => (a.name||'').localeCompare(b.name||'', 'zh-Hans-CN', { sensitivity: 'base', numeric: true }));
      renderCategory(cat.key, cat.name, arr, fallback);
    });

  } catch (err) {
    console.error('Error loading menu', err);
    showLoadErrorsForAll();
  }
}

// render a single category given shortKey and data array
function renderCategory(shortKey, chineseName, items, fallback) {
  const leftId = `${shortKey}-left-image`;
  const listId = `${shortKey}-dishes-list-container`;

  const leftWrapper = document.getElementById(leftId);
  const listContainer = document.getElementById(listId);

  if (!listContainer) return;

  if (!Array.isArray(items) || items.length === 0) {
    listContainer.innerHTML = '<p class="muted">暂无菜品</p>';
    return;
  }

  // Update existing big image (preserve wrapper)
  if (leftWrapper) {
    const first = items[0];
    const bigImgUrl = first.image && first.image.length ? first.image : fallback;
    let bigImgEl = leftWrapper.querySelector('img');
    if (!bigImgEl) {
      bigImgEl = document.createElement('img');
      bigImgEl.setAttribute('width', '80%');
      leftWrapper.appendChild(bigImgEl);
    }
    bigImgEl.src = bigImgUrl;
    bigImgEl.alt = first.name || chineseName;
  }

  // Build list
  listContainer.innerHTML = '';
  const frag = document.createDocumentFragment();

  items.forEach(d => {
    const item = document.createElement('div');
    item.className = 'item-wrapper d-flex justify-content-between align-items-center py-2';

    // left: thumbnail + text
    const left = document.createElement('div');
    left.className = 'item-left d-flex align-items-center';

    const thumbWrap = document.createElement('div');
    thumbWrap.className = 'ps-3 me-3 d-flex align-items-center';
    thumbWrap.style.flex = '0 0 90px';

    const thumb = document.createElement('img');
    thumb.src = (d.image && d.image.length) ? d.image : fallback;
    thumb.alt = d.name || 'dish';
    thumb.style.width = '70px';
    thumb.style.height = '70px';
    thumb.style.objectFit = 'cover';
    thumb.style.borderRadius = '6px';
    thumb.style.border = '1px solid #ddd';
    thumb.style.cursor = 'pointer';
    thumb.classList.add('dish-clickable');
    thumb.dataset.id = d._id;
    // attach data for click-to-swap
    thumb.dataset.shortKey = shortKey;
    thumb.dataset.src = thumb.src;

    thumbWrap.appendChild(thumb);

    const txt = document.createElement('div');
    const h5 = document.createElement('h5');
    h5.textContent = d.name || '无名菜';
    h5.classList.add('dish-clickable');
    h5.dataset.id = d._id;
    h5.style.cursor = 'pointer';
    h5.style.margin = '0';
    const p = document.createElement('p');
    p.textContent = d.description || '';
    p.style.margin = '0';

    txt.appendChild(h5);
    txt.appendChild(p);

    left.appendChild(thumbWrap);
    left.appendChild(txt);

    // right: order button
    const right = document.createElement('div');
    right.className = 'item-right pe-3';
    const btnWrap = document.createElement('div');
    btnWrap.className = 'item-btn';
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = 'Order';
    a.dataset.id = d._id || '';
    btnWrap.appendChild(a);
    right.appendChild(btnWrap);

    item.appendChild(left);
    item.appendChild(right);

    frag.appendChild(item);
  });

  listContainer.appendChild(frag);

  // hook up click-to-swap for thumbnails in this category
  listContainer.querySelectorAll('img[data-short-key]').forEach(img => {
    img.addEventListener('click', (e) => {
      const sk = e.currentTarget.dataset.shortKey;
      const src = e.currentTarget.dataset.src;
      const targetLeft = document.getElementById(`${sk}-left-image`);
      if (!targetLeft) return;
      const bigImg = targetLeft.querySelector('img') || (() => {
        const i = document.createElement('img');
        i.setAttribute('width', '80%');
        targetLeft.appendChild(i);
        return i;
      })();
      bigImg.src = src || fallback;
      bigImg.alt = e.currentTarget.alt || chineseName;
    });
  });

  // refresh AOS if used
  if (window.AOS && typeof window.AOS.refresh === 'function') window.AOS.refresh();
}

function showLoadErrorsForAll() {
  document.querySelectorAll('[id$="-dishes-list-container"]').forEach(el => {
    if (el) el.innerHTML = '<p class="muted">无法加载菜品</p>';
  });
}



// global click handler
document.addEventListener('click', async function (e) {
  const target = e.target.closest('.dish-clickable');
  if (!target) return;

  const dishId = target.dataset.id;
  if (!dishId) return;

  try {
    const res = await fetch('/api/dishes/' + dishId);
    if (!res.ok) return;

    const dish = await res.json();

    if (dishDetailImage) {
      dishDetailImage.src = dish.image || 'https://res.cloudinary.com/dhajpkcjc/image/upload/v1770945786/food_placeholder_lj4kwj.png';
      dishDetailImage.alt = dish.name || 'Dish';
    }

    if (dishDetailName) {
      dishDetailName.textContent = dish.name || '';
    }

    if (dishDetailDescription) {
      dishDetailDescription.textContent = dish.description || '';
    }

    if (dishDetailReviewsList) {
      dishDetailReviewsList.innerHTML = '';
    }

    if (dishDetailEmpty) {
      dishDetailEmpty.style.display = 'block';
    }

    openDishDetail();
  } catch (err) {
    console.error('Failed to load dish detail', err);
  }
});









// daily specials renderer (debug-friendly, robust)
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(renderDailySpecials, 50); // tiny delay so DOM is fully ready
});

async function renderDailySpecials() {
  const api = '/api/dishes/daily';
  const listId = 'chef-daily-list';
  const leftImgSelector = '#chef-left-image img';
  const sliderSelector = '.chef-choise-slider';


  const listEl = document.getElementById(listId);
  const bigImgEl = document.querySelector(leftImgSelector);


  if (!listEl) {
    console.warn('[CLIENT] Missing container #' + listId + ' — script will not render. Ensure HTML contains id="' + listId + '"');
    return;
  }

  listEl.innerHTML = '<p class="muted">加载中…</p>';

  try {
    const res = await fetch(api, { cache: 'no-store' });

    if (!res.ok) {
      console.error('[CLIENT] /daily fetch failed', res.status, await res.text().catch(()=>null));
      listEl.innerHTML = '<p class="muted">无法加载每日特选</p>';
      return;
    }

    const specials = await res.json();

    if (!Array.isArray(specials) || specials.length === 0) {
      listEl.innerHTML = '<p class="muted">暂无每日特选</p>';
      return;
    }

    // update big image (use first)
    if (bigImgEl && specials[0]) {
      bigImgEl.src = specials[0].image || 'https://res.cloudinary.com/dhajpkcjc/image/upload/v1770945786/food_placeholder_lj4kwj.png';
      bigImgEl.alt = specials[0].name || 'Special';
    } else {
      console.warn('[CLIENT] Big image element not found or no first special');
    }

    // populate list
    listEl.innerHTML = '';
    specials.forEach(d => {
      const item = document.createElement('div');
      item.className = 'item-wrapper d-flex justify-content-between';

      const left = document.createElement('div');
      left.className = 'item-left d-flex flex-row';

      const img = document.createElement('img');
      img.classList.add('dish-clickable');
      img.dataset.id = d._id;
      img.style.cursor = 'pointer';
      img.className = 'rounded-circle';
      img.width = 70; img.height = 70;
      img.alt = d.name || 'dish';
      img.src = d.image || 'https://res.cloudinary.com/dhajpkcjc/image/upload/v1770945786/food_placeholder_lj4kwj.png';
      left.appendChild(img);

      const txt = document.createElement('div');
      txt.className = 'ps-3';
      const h5 = document.createElement('h5');
      h5.className = 'text-white';
      h5.textContent = d.name || '无名菜';
      h5.classList.add('dish-clickable');
      h5.dataset.id = d._id;
      h5.style.cursor = 'pointer';
      const p = document.createElement('p');
      p.className = 'mb-0';
      p.textContent = d.description || '';
      txt.appendChild(h5);
      txt.appendChild(p);
      left.appendChild(txt);

      const right = document.createElement('div');
      right.className = 'item-right';
      

      // right: order button
        const btnWrap = document.createElement('div');
        btnWrap.className = 'item-btn';

        // ORDER anchor with inline styles (so it's always visible)
        const a = document.createElement('a');
        a.href = '#';
        a.className = 'order-btn';
        a.setAttribute('data-id', d._id || '');
        a.textContent = 'Order';

        // inline style to match requested look (primary color #e5612f)
        a.style.textDecoration = 'none';
        a.style.color = '#ffffff';
        a.style.backgroundColor = '#e5612f';
        a.style.padding = '6px 14px';
        a.style.fontSize = '13px';
        a.style.textTransform = 'uppercase';
        a.style.borderRadius = '18px';
        a.style.display = 'inline-block';

        btnWrap.appendChild(a);
        right.appendChild(btnWrap);

    

      item.appendChild(left);
      item.appendChild(right);
      listEl.appendChild(item);
    });


    // If you use AOS
    if (window.AOS && typeof window.AOS.refresh === 'function') {
      window.AOS.refresh();
    }

    // If you use slick carousel on .chef-choise-slider, try refreshing/re-init
    if (window.jQuery && jQuery.fn && jQuery.fn.slick && document.querySelector(sliderSelector)) {
      const $slider = jQuery(sliderSelector);
      if ($slider.hasClass('slick-initialized')) {
        $slider.slick('refresh');
      } else {
        // initialize with basic options (adjust as needed)
        $slider.slick && $slider.slick({ slidesToShow: 1, arrows: false, dots: false });
      }
    }

  } catch (err) {
    console.error('[CLIENT] renderDailySpecials error', err);
    listEl.innerHTML = '<p class="muted">无法加载每日特选</p>';
  }
}





// ---- Search overlay + results handling ----
// Assumes you already have variables searchBtn, searchBtnMobile, search-close-btn, search-container declared.
// If not, the code below will (re)select them safely.

const searchBtnMain = document.getElementById("searchBtn");
const searchInput = document.getElementById("search-input");
const searchSubmitBtn = document.getElementById("search-submit-btn");
const searchResults = document.getElementById("search-results");

function showSearchOverlay() {
  if (!searchCon) return;
  searchCon.classList.remove('d-none');
  requestAnimationFrame(() => searchCon.classList.add('show'));
  setTimeout(() => searchInput && searchInput.focus(), 50);
}

function clearSearchResults() {
  if (searchResults) searchResults.innerHTML = '';
}

function hideSearchOverlay() {
  if (!searchCon) return;
  searchCon.classList.remove('show');
  setTimeout(() => {
    searchCon.classList.add('d-none');
    clearSearchResults();
    if (searchInput) searchInput.value = '';
  }, 200);
}

// Wire open handlers (preserve your UI behavior)
if (searchBtnMain) {
  searchBtnMain.addEventListener('click', (event) => {
    event.preventDefault();
    showSearchOverlay();
  });
}
if (searchBtnMobile) {
  searchBtnMobile.addEventListener('click', (event) => {
    event.preventDefault();
    showSearchOverlay();
  });
}

// Close handler
if (closeBtn) {
  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideSearchOverlay();
  });
}

// Clicking overlay background closes (optional)
searchCon && searchCon.addEventListener('click', (e) => {
  const inner = e.target.closest('.search-bar-wrapper');
  if (!inner) hideSearchOverlay();
});

// IMPORTANT: we DO NOT run a search on input or Enter per your request.
// So remove or ignore input 'input' and keydown Enter handlers.
// Only wire click on the search button to perform search.

async function performSearch(q) {
  if (!searchResults) return;
  const query = (q || '').trim();
  if (!query) {
    searchResults.innerHTML = '<p class="muted">请输入关键词后点击搜索</p>';
    return;
  }

  searchResults.innerHTML = '<p class="muted">搜索中…</p>';

  try {
    const res = await fetch('/api/dishes?q=' + encodeURIComponent(query));
    if (!res.ok) {
      const txt = await res.text().catch(()=>'');
      searchResults.innerHTML = `<p class="text-danger">搜索失败（${res.status}）</p>`;
      console.error('Search failed', res.status, txt);
      return;
    }
    const data = await res.json();
    renderSearchResults(data);
  } catch (err) {
    console.error('Search error', err);
    searchResults.innerHTML = '<p class="text-danger">搜索时出错，请稍后再试</p>';
  }
}

function renderSearchResults(items = []) {
  if (!searchResults) return;
  searchResults.innerHTML = '';

  if (!items || items.length === 0) {
    searchResults.innerHTML = '<p class="muted">未找到匹配菜品</p>';
    return;
  }

  items.forEach(d => {
    const row = document.createElement('div');
    row.className = 'd-flex align-items-center py-3 search-result-row';

    const thumb = document.createElement('img');
    thumb.src = d.image || 'https://res.cloudinary.com/dhajpkcjc/image/upload/v1770945786/food_placeholder_lj4kwj.png';
    thumb.alt = d.name || 'dish';
    thumb.className = 'search-thumb me-3';
    thumb.classList.add('dish-clickable');
    thumb.dataset.id = d._id;
    thumb.style.cursor = 'pointer';

    const meta = document.createElement('div');
    meta.style.flex = '1';

    const title = document.createElement('div');
    title.className = 'fw-semibold';
    title.textContent = d.name || '无名菜';
    title.classList.add('dish-clickable');
    title.dataset.id = d._id;
    title.style.cursor = 'pointer';

    const desc = document.createElement('div');
    desc.className = 'text-muted small mb-0';
    desc.textContent = d.description || '';

    meta.appendChild(title);
    meta.appendChild(desc);

    const orderWrap = document.createElement('div');
    orderWrap.className = 'ms-3';
    const orderBtn = document.createElement('a');
    orderBtn.href = '#';
    orderBtn.className = 'item-order-btn';
    orderBtn.textContent = 'Order';
    orderBtn.dataset.id = d._id || '';


    orderWrap.appendChild(orderBtn);

    row.appendChild(thumb);
    row.appendChild(meta);
    row.appendChild(orderWrap);

    searchResults.appendChild(row);
  });
}

// ====================== floating detail page ======================
const dishDetailPanel = document.querySelector('.dish-detail-panel');
const dishDetailClose = document.querySelector('.dish-detail-close');
const dishDetailImage = document.querySelector('.dish-detail-image');
const dishDetailName = document.querySelector('.dish-detail-name');
const dishDetailDescription = document.querySelector('.dish-detail-description');
const dishDetailReviewsList = document.querySelector('.dish-detail-reviews-list');
const dishDetailEmpty = document.querySelector('.dish-detail-empty');

function openDishDetail() {
  if (!dishDetailPanel) return;
  dishDetailPanel.classList.add('open');
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}

function closeDishDetail() {
  if (!dishDetailPanel) return;
  dishDetailPanel.classList.remove('open');
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
}

dishDetailClose?.addEventListener('click', (e) => {
  e.preventDefault();
  closeDishDetail();
});


// wire click-to-search behavior ONLY
if (searchSubmitBtn) {
  searchSubmitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    performSearch(searchInput ? searchInput.value : '');
  });
}













// ====================== SHOPPING CART ======================
const cart = [];

const shoppingCartBody = document.querySelector('.shopping-cart-body');
const continueBtn = document.querySelector('.footer-shopping a');
const checkoutBtn = document.querySelector('.footer-checkout a');
const checkoutModal = document.getElementById('checkout-modal');
const checkoutModalMessage = document.getElementById('checkout-modal-message');
const checkoutModalDone = document.getElementById('checkout-modal-done');
const checkoutModalBackdrop = document.getElementById('checkout-modal-backdrop');

// Open cart
function openCart() {
  // shoppingCart.style.right = "0";
  shoppingCart.classList.add('open');
}

// Close cart
function closeCart() {
  // shoppingCart.style.right = "-100vw";
  shoppingCart.classList.remove('open');
}

shoppingbtn?.addEventListener('click', e => {
  e.preventDefault();
  openCart();
});

shoppingbtnMobile?.addEventListener('click', e => {
  e.preventDefault();
  openCart();
});

cartClose.forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    closeCart();
  });
});

// Continue shopping closes cart
continueBtn?.addEventListener('click', e => {
  e.preventDefault();
  closeCart();
});

// helper: show modal with message
function openCheckoutModal(msg = '') {
  if (!checkoutModal) return;
  checkoutModalMessage.textContent = msg;
  checkoutModal.classList.add('show');
  checkoutModal.setAttribute('aria-hidden', 'false');
  // trap focus to the Done button
  setTimeout(() => checkoutModalDone && checkoutModalDone.focus(), 30);
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}
function closeCheckoutModal() {
  if (!checkoutModal) return;
  checkoutModal.classList.remove('show');
  checkoutModal.setAttribute('aria-hidden', 'true');
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
}

// DONE button: simply closes modal (cart already cleared on success)
checkoutModalDone && checkoutModalDone.addEventListener('click', (e) => {
  e.preventDefault();
  closeCheckoutModal();
});

// optionally clicking backdrop will not close modal to force Done click — comment out if you want backdrop close
// checkoutModalBackdrop && checkoutModalBackdrop.addEventListener('click', () => closeCheckoutModal());

// ---------- Checkout -> EmailJS (build templateParams matching your template) ----------
checkoutBtn && checkoutBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  if (!Array.isArray(cart) || cart.length === 0) {
    openCheckoutModal('购物车为空，无法下单');
    return;
  }

  // 1) make sure user is signed in
  try {
    const meRes = await fetch('/api/auth/me', {
      credentials: 'include'
    });

    if (!meRes.ok) {
      openCheckoutModal('请先登录再下单');
      setTimeout(() => {
        window.location.href = '/login.html';
      }, 1200);
      return;
    }
  } catch (err) {
    openCheckoutModal('无法验证登录状态，请稍后重试');
    return;
  }

  // 2) order number = today's date only
  function getOrderIdYYYYMMDD() {
    const laDate = new Date().toLocaleDateString('en-CA', {
      timeZone: 'America/Los_Angeles'
    });
    return laDate.replace(/-/g, '');
  }

  const orderNo = getOrderIdYYYYMMDD();


  const items = cart.map(item => ({
  dishId: item._id,
  quantity: 1
}));

openCheckoutModal('正在保存订单，请稍候…');


try {
  const orderRes = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      items
    })
  });

  const orderData = await orderRes.json();

  if (!orderRes.ok) {
    throw new Error(orderData.error || '保存订单失败');
  }

  const orders = cart.map(item => ({
    name: item.name || '',
    units: item.description || '',
    price: 1,
    image_url: item.image || ''
  }));

  const templateParams = {
    order_id: orderData.order?.orderNo || '',
    orders,
    total_items: cart.length
  };

  if (!window.emailjs || typeof emailjs.send !== 'function') {
    throw new Error('EmailJS SDK 未加载');
  }

  const SERVICE_ID = 'service_5nzocu9';
  const TEMPLATE_ID = 'template_881vabm';

  await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);

  cart.length = 0;
  renderCart();

  openCheckoutModal('下单成功 — 订单已保存并已发送邮件（点击 Done 关闭）');
} catch (err) {
  console.error('Checkout error', err);
  openCheckoutModal(err.message || '下单失败：请稍后重试');
}
});

// small helper to escape HTML in descriptions
function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}




function renderCart() {
  if (!shoppingCartBody) return;

  shoppingCartBody.innerHTML = '';

  if (cart.length === 0) {
    shoppingCartBody.innerHTML = `
      <div class="text-center py-4">
        <p>购物车为空</p>
      </div>
    `;
    return;
  }

  cart.forEach(item => {

    const row = document.createElement('div');
    row.className = 'row shopping-cart-item d-flex justify-content-between align-items-center';

    // Image column
    const colImg = document.createElement('div');
    colImg.className = 'col-2 d-flex align-items-center';
    const img = document.createElement('img');
    img.src = item.image || 'https://res.cloudinary.com/dhajpkcjc/image/upload/v1770945786/food_placeholder_lj4kwj.png';
    img.alt = item.name;
    colImg.appendChild(img);

    // Name + Description column
    const colInfo = document.createElement('div');
    colInfo.className = 'col-7';

    const h3 = document.createElement('h3');
    h3.textContent = item.name;

    const desc = document.createElement('p');
    desc.textContent = item.description;
    desc.style.fontSize = '12px';
    desc.style.marginBottom = '0';
    desc.style.color = '#666';

    colInfo.appendChild(h3);
    colInfo.appendChild(desc);

    // Quantity + Delete column
    const colRight = document.createElement('div');
    colRight.className = 'col-3 item-price d-flex align-items-center justify-content-end';

    const qty = document.createElement('p');
    qty.className = 'mb-0';
    qty.textContent = 'x1';
    qty.style.marginRight = '10px';

    const del = document.createElement('a');
    del.href = '#';
    del.className = 'cart-delete-btn';
    del.dataset.id = item._id;
    del.textContent = '删除';

    // del.style.color = '#e5612f';
    del.style.fontSize = '15px';
    del.style.textDecoration = 'none';
    del.style.color = '#ffffff';
    del.style.backgroundColor = '#e5612f';
    del.style.padding = '6px 14px';
    del.style.borderRadius = '18px';
    del.style.display = 'inline-block';

    colRight.appendChild(qty);
    colRight.appendChild(del);

    row.appendChild(colImg);
    row.appendChild(colInfo);
    row.appendChild(colRight);

    shoppingCartBody.appendChild(row);
  });
}

// Add to cart
async function addToCart(id) {
  if (!id) return;

  // Prevent duplicates
  if (cart.some(item => item._id === id)) {
    showToast("菜品已存在于购物车中");
    openCart();
    return;
  }

  try {
    const res = await fetch('/api/dishes/' + id);
    if (!res.ok) return;

    const dish = await res.json();

    cart.push({
      _id: dish._id,
      name: dish.name,
      description: dish.description || '',
      image: dish.image
    });

    renderCart();
    openCart();
    showToast("已加入购物车");

  } catch (err) {
    console.error(err);
  }
}

// Global ORDER button listener (menu + search)
document.addEventListener('click', function(e) {
  const btn = e.target.closest('.order-btn, .item-order-btn, .item-btn a');
  if (!btn) return;

  const id = btn.dataset.id;
  if (!id) return;

  e.preventDefault();
  addToCart(id);
});


// delegated delete handler with fade animation
document.addEventListener('click', function (e) {
  const delBtn = e.target.closest('.cart-delete-btn');
  if (!delBtn) return;
  e.preventDefault();

  const id = delBtn.dataset.id;
  if (!id) return;

  // find the corresponding DOM row (closest shopping-cart-item)
  const row = delBtn.closest('.shopping-cart-item');
  if (!row) {
    // fallback: immediate remove if DOM row not found
    const idx = cart.findIndex(i => i._id === id);
    if (idx >= 0) {
      cart.splice(idx, 1);
      renderCart();
      showToast('已从购物车移除');
    }
    return;
  }

  // add removing class to animate out
  row.classList.add('removing');

  // after animation duration, remove from cart and re-render
  const ANIM_MS = 360; // slightly longer than CSS transition to be safe
  setTimeout(() => {
    const idx = cart.findIndex(i => i._id === id);
    if (idx >= 0) {
      cart.splice(idx, 1);
    }
    renderCart();
    showToast('已从购物车移除');
  }, ANIM_MS);
});

// Close shopping cart when clicking outside of it
document.addEventListener('click', function (e) {
  // If cart is not open, do nothing
  if (!shoppingCart || shoppingCart.style.right !== "0px") return;

  // Check if click happened inside the cart
  const isInsideCart = e.target.closest('.shopping-cart');

  // Check if click was on shopping button (to prevent immediate close)
  const isCartButton =
    e.target.closest('#shoppingbutton') ||
    e.target.closest('#shoppingbuttonMobile');

  if (!isInsideCart && !isCartButton) {
    closeCart();
  }
});

// Simple toast popup
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 1800);
}


