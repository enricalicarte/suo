function() {
  var iframeId = 'ai-avatar-iframe-' + Math.random().toString(36).substr(2, 9);
  var iframe = document.createElement('iframe');
  var baseUrl = 'https://copy-of-video-avatar-configurator-622291485897.us-west1.run.app/?mode=embedded';
  
  iframe.id = iframeId;
  iframe.src = baseUrl;
  iframe.title = 'AI Video Avatar';
  iframe.setAttribute('allow', 'microphone');
  
  // Inject Responsive Styles
  var style = document.createElement('style');
  style.textContent = `
    #${iframeId} {
        border: none;
        position: fixed;
        z-index: 9999;
        border-radius: 16px;
        overflow: hidden;
        pointer-events: none; /* Let clicks pass through when idle (handled internally via pointer-events: auto in button) */
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
        
        /* Desktop Default */
        right: 20px;
        bottom: 20px;
        width: 320px;
        height: 160px;
    }
    
    /* Mobile Responsive */
    @media (max-width: 640px) {
        #${iframeId} {
            right: 3%;
            left: 3%;
            bottom: 16px;
            width: 94%; /* Full width minus margins */
            height: 120px; /* More compact on mobile */
            border-radius: 20px;
        }
    }
  `;
  document.head.appendChild(style);
  
  // Allow pointer events on the iframe itself so interactivity works
  iframe.style.pointerEvents = 'auto'; 

  // 1. Configuration (Obfuscated)
  var encodedConfig = 'eyJzeXN0ZW1JbnN0cnVjdGlvbiI6IkVyZXMgdW4gYXNpc3RlbnRlIHZpcnR1YWwgcXVlIGVzdGEgZW4gbGEgcGFnaW5hIGRlIHN1b2JhcmVmb290LmVzIHkgcHVlZGVzIHJlc3BvbmRlciBhIGN1bGFxdWllciBwcmVndW50YSBzb2JyZSBjb25zZWpvcyBkZSBjYWx6YWRvIGJhcmVmb290LiBBZGVtw6FzIHB1ZWRlcyBtb3ZlciBsYSBwYWdpbmEgeSB2ZXIgc3UgY29udGVuaWRvIHBhcmEgZXhwbGljYXIgYSBsb3MgdXN1YXJpb3MgbG8gcXVlIHB1ZWRlbiBlbmNvbnRyYXIgZGVudHJvIGRlIGxhIHBhZ2luYSB3ZWIiLCJ2b2ljZSI6IkNoYXJvbiJ9';

  // 2. Helper to extract page context (Reading the website)
  function getPageContent() {
    // Simple scraper: gets visible text from body, cleans up whitespace, limits length
    var text = document.body.innerText || "";
    return text.replace(/\s+/g, ' ').substring(0, 15000); // Limit to ~15k chars for context window
  }

  // 3. Initialize Iframe
  iframe.onload = function() {
    if (iframe.contentWindow) {
      var sendConfig = function() {
        try {
            var decodedJson = decodeURIComponent(escape(atob(encodedConfig)));
            var config = JSON.parse(decodedJson);
            
            // Inject current page content into config
            config.pageContent = getPageContent();
            
            iframe.contentWindow.postMessage(config, '*');
        } catch (e) {
            console.error('Avatar: Failed to init configuration.', e);
        }
      };

      // Retry mechanism
      sendConfig();
      setTimeout(sendConfig, 500);
      setTimeout(sendConfig, 1500);
    }
  };

  // 4. Listen for Commands from the Avatar (Navigation/Scrolling/Cart)
  window.addEventListener('message', function(event) {
    if (!event.data || typeof event.data !== 'object') return;

    if (event.data.type === 'AVATAR_ACTION') {
        const cmd = event.data.command;
        const args = event.data.args;

        if (cmd === 'scrollPage') {
            if (args.direction === 'up') window.scrollBy({ top: -500, behavior: 'smooth' });
            else if (args.direction === 'down') window.scrollBy({ top: 500, behavior: 'smooth' });
            else if (args.direction === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
            else if (args.direction === 'bottom') window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
        
        if (cmd === 'navigatePage') {
             if (args.url) window.location.href = args.url;
        }

        if (cmd === 'addToCart') {
            console.log("Avatar adding to cart:", args.productName);
            
            // A. Dispatch a standard event so developers can hook their own logic
            var customEvent = new CustomEvent('avatar-add-to-cart', { detail: args });
            window.dispatchEvent(customEvent);

            // B. Fallback: Try to find an "Add to Cart" button and click it (Heuristic)
            var buttons = Array.from(document.querySelectorAll('button, a, input[type="submit"]'));
            var targetBtn = buttons.find(b => {
                var t = b.innerText.toLowerCase();
                return (t.includes('add') || t.includes('cart') || t.includes('comprar') || t.includes('añadir')) && 
                       (t.includes(args.productName.toLowerCase()) || document.title.toLowerCase().includes(args.productName.toLowerCase()) || buttons.length < 5);
            });
            
            if (targetBtn) {
                targetBtn.click();
                var toast = document.createElement('div');
                toast.innerText = '🛒 Adding ' + args.productName + ' to cart...';
                toast.style.cssText = 'position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#10b981; color:white; padding:10px 20px; border-radius:8px; z-index:10000; box-shadow:0 4px 6px rgba(0,0,0,0.1); font-family:sans-serif;';
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 3000);
            }
        }
    }
  });

  document.body.appendChild(iframe);
}();

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
  const mobileMenuBtn = document.getElementById('menuBtn');
  let mobileMenu = document.getElementById('mobileMenu');
  
  if (mobileMenuBtn && mobileMenu) {
    // MOVER el menú móvil fuera del header para evitar conflictos de z-index
    if (mobileMenu.parentElement.tagName === 'HEADER' || 
        mobileMenu.closest('header')) {
      document.body.appendChild(mobileMenu);
      console.log('Menú móvil movido fuera del header');
    }
    
    // Asegurar que tiene el z-index correcto
    mobileMenu.style.zIndex = '100';
    
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('menu-open');
      const bar1 = document.getElementById('bar1');
      const bar2 = document.getElementById('bar2');
      const bar3 = document.getElementById('bar3');

      if (!isOpen) {
        // Abrir menú
        mobileMenu.classList.add('menu-open');
        document.body.style.overflow = 'hidden'; // Prevenir scroll
        
        // Animar hamburguesa a X
        if (bar1 && bar2 && bar3) {
          bar1.classList.add('rotate-45');
          bar2.classList.add('opacity-0');
          bar3.classList.add('-rotate-45');
        }
      } else {
        // Cerrar menú
        mobileMenu.classList.remove('menu-open');
        document.body.style.overflow = ''; // Restaurar scroll
        
        // Animar X de vuelta a hamburguesa
        if (bar1 && bar2 && bar3) {
          bar1.classList.remove('rotate-45');
          bar2.classList.remove('opacity-0');
          bar3.classList.remove('-rotate-45');
        }
      }
    });

    // Cerrar menú al hacer clic en un enlace
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('menu-open');
        document.body.style.overflow = '';
        
        const bar1 = document.getElementById('bar1');
        const bar2 = document.getElementById('bar2');
        const bar3 = document.getElementById('bar3');
        
        if (bar1 && bar2 && bar3) {
          bar1.classList.remove('rotate-45');
          bar2.classList.remove('opacity-0');
          bar3.classList.remove('-rotate-45');
        }
      });
    });
  } else {
    console.log('Error: No se encontró el menú o el botón');
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




