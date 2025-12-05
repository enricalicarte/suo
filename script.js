// --- Cargar header y footer dinámicamente ---
function loadFragment(id, file) {
  return fetch(file)
    .then(res => res.text())
    .then(html => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    })
    .catch(err => console.error(`Error al cargar ${file}:`, err));
}

// --- 1️⃣ Menú móvil ---
function initMenu() {
  const mobileMenuBtn = document.querySelector('button[aria-label="Toggle menu"]');
  const mobileMenuOverlay = document.querySelector('.fixed.top-0.left-0.w-full.h-screen');
  
  if (mobileMenuBtn && mobileMenuOverlay) {
    mobileMenuBtn.addEventListener('click', () => {
      // Check if hidden by checking transform class
      const isClosed = mobileMenuOverlay.classList.contains('-translate-y-full');
      const spans = mobileMenuBtn.querySelectorAll('span');

      if (isClosed) {
        // Open
        mobileMenuOverlay.classList.remove('-translate-y-full');
        mobileMenuOverlay.classList.add('translate-y-0');
        
        // Animate Hamburger to X
        if(spans.length === 3) {
          spans[0].classList.add('rotate-45', 'translate-y-2');
          spans[1].classList.add('opacity-0');
          spans[2].classList.add('-rotate-45', '-translate-y-2');
        }
      } else {
        // Close
        mobileMenuOverlay.classList.remove('translate-y-0');
        mobileMenuOverlay.classList.add('-translate-y-full');

        // Animate X back to Hamburger
        if(spans.length === 3) {
          spans[0].classList.remove('rotate-45', 'translate-y-2');
          spans[1].classList.remove('opacity-0');
          spans[2].classList.remove('-rotate-45', '-translate-y-2');
        }
      }
    });
  }
}

// --- 2️⃣ Acordeón de FAQ ---
function initFAQ() {
  const faqQuestions = document.querySelectorAll(".faq-question");
  if (!faqQuestions.length) return;

  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const answer = question.nextElementSibling;
      const icon = question.querySelector(".faq-icon");
      if (!answer) return;

      answer.classList.toggle("hidden");
      if (icon) {
        icon.style.transform = answer.classList.contains("hidden")
          ? "rotate(0deg)"
          : "rotate(180deg)";
      }
    });
  });
}

// --- 3️⃣ Formulario de newsletter ---
function initNewsletter() {
  const form = document.getElementById("newsletterForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("newsletterEmail");
    if (!emailInput) return;
    const email = emailInput.value;
    alert(`¡Gracias por suscribirte! Te enviaremos novedades a ${email}`);
    emailInput.value = "";
  });
}

// --- 4️⃣ Filtros del catálogo de calzado ---
function initCatalogFilters() {
  const productCards = document.querySelectorAll('.product-card');
  
  // Only run if we are on the products page
  if (productCards.length === 0) return;

  const searchInput = document.getElementById('static-search');
  const categoryBtns = document.querySelectorAll('.static-category-btn');
  const priceInput = document.getElementById('static-price');
  const priceDisplay = document.getElementById('static-price-value');
  const sizeBtns = document.querySelectorAll('.static-size-btn');
  const resetBtn = document.getElementById('static-reset');
  
  const mobileFilterToggle = document.getElementById('static-mobile-filter-toggle');
  const sidebar = document.getElementById('static-sidebar');

  // State to track current filters
  let state = {
    search: '',
    category: null,
    price: 200,
    size: null
  };

  // Helper to toggle visibility
  function filterProducts() {
    productCards.forEach(card => {
      const name = (card.dataset.name || '').toLowerCase();
      const brand = (card.dataset.brand || '').toLowerCase();
      const pCategory = card.dataset.category;
      const pPrice = parseFloat(card.dataset.price);
      // Sizes stored as "36,37,38" string
      const pSizes = card.dataset.sizes ? card.dataset.sizes.split(',').map(Number) : [];

      const term = state.search.toLowerCase();
      const matchesSearch = name.includes(term) || brand.includes(term);
      const matchesCategory = state.category ? pCategory === state.category : true;
      const matchesPrice = pPrice <= state.price;
      const matchesSize = state.size ? pSizes.includes(state.size) : true;

      if (matchesSearch && matchesCategory && matchesPrice && matchesSize) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Search Listener
  if(searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.search = e.target.value;
      filterProducts();
    });
  }

  // Category Listeners
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.category;
      state.category = cat === 'all' ? null : cat;

      // Visual Update
      categoryBtns.forEach(b => {
        b.classList.remove('font-bold', 'text-suo-green');
      });
      btn.classList.add('font-bold', 'text-suo-green');

      filterProducts();
    });
  });

  // Price Listener
  if(priceInput) {
    priceInput.addEventListener('input', (e) => {
      state.price = parseFloat(e.target.value);
      if(priceDisplay) priceDisplay.textContent = state.price + ' €';
      filterProducts();
    });
  }

  // Size Listeners
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const s = parseInt(btn.dataset.size);
      
      if (state.size === s) {
        // Toggle Off
        state.size = null;
        btn.classList.remove('bg-suo-green', 'text-white', 'border-suo-green');
        btn.classList.add('border-gray-200', 'text-gray-600');
      } else {
        // Select
        state.size = s;
        // Reset others
        sizeBtns.forEach(b => {
          b.classList.remove('bg-suo-green', 'text-white', 'border-suo-green');
          b.classList.add('border-gray-200', 'text-gray-600');
        });
        // Highlight active
        btn.classList.remove('border-gray-200', 'text-gray-600');
        btn.classList.add('bg-suo-green', 'text-white', 'border-suo-green');
      }
      filterProducts();
    });
  });

  // Reset Listener
  if(resetBtn) {
    resetBtn.addEventListener('click', () => {
      // Reset State
      state = { search: '', category: null, price: 200, size: null };
      
      // Reset Inputs UI
      if(searchInput) searchInput.value = '';
      if(priceInput) priceInput.value = 200;
      if(priceDisplay) priceDisplay.textContent = '200 €';

      // Reset Categories UI
      categoryBtns.forEach(b => b.classList.remove('font-bold', 'text-suo-green'));
      const allBtn = document.querySelector('.static-category-btn[data-category="all"]');
      if(allBtn) allBtn.classList.add('font-bold', 'text-suo-green');

      // Reset Sizes UI
      sizeBtns.forEach(b => {
        b.classList.remove('bg-suo-green', 'text-white', 'border-suo-green');
        b.classList.add('border-gray-200', 'text-gray-600');
      });

      filterProducts();
    });
  }

  // Mobile Sidebar Toggle
  if (mobileFilterToggle && sidebar) {
    mobileFilterToggle.addEventListener('click', () => {
      if (sidebar.classList.contains('hidden')) {
        sidebar.classList.remove('hidden');
        mobileFilterToggle.textContent = 'Cerrar Filtros';
      } else {
        sidebar.classList.add('hidden');
        mobileFilterToggle.textContent = 'Filtrar Productos';
      }
    });
  }
}

// --- 5️⃣ Filtros del blog ---
function initBlogFilters() {
  const blogCards = document.querySelectorAll('.blog-post-card');
  if (blogCards.length === 0) return;

  const blogFilterBtns = document.querySelectorAll('.blog-filter-btn');

  blogFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update Buttons UI
      blogFilterBtns.forEach(b => {
        b.classList.remove('bg-suo-green', 'text-white');
        b.classList.add('bg-white', 'text-suo-dark');
      });
      btn.classList.remove('bg-white', 'text-suo-dark');
      btn.classList.add('bg-suo-green', 'text-white');

      // Filter Logic
      blogCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = 'block'; 
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// --- Función de inicialización ---
async function initAll() {
  await Promise.all([
    loadFragment("header", "/header.html"),
    loadFragment("footer", "/footer.html")
  ]);

  initMenu();
  initFAQ();
  initNewsletter();
  initCatalogFilters();
  initBlogFilters();
}

// --- Iniciar cuando la página esté lista ---
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAll);
} else {
  initAll();
}
