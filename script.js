document.addEventListener('DOMContentLoaded', () => {
  // --- GLOBAL: HEADER MOBILE MENU ---
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

  // --- PRODUCTS PAGE: FILTERS ---
  const productCards = document.querySelectorAll('.product-card');
  
  // Only run if we are on the products page
  if (productCards.length > 0) {
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
                  // Re-add hover/base classes if needed, though Tailwind classes persist
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
              // Optionally highlight "Ver Todo" if we could identify it easily, 
              // or just removing highlights implies "All"
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
               // The sidebar has 'hidden lg:block' classes. 
               // In static JS we just toggle 'hidden' class manually.
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

  // --- BLOG PAGE: FILTERS ---
  const blogCards = document.querySelectorAll('.blog-post-card');
  if (blogCards.length > 0) {
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
                  // If filter is 'all' or specific match
                  if (filter === 'all' || category === filter) {
                      card.style.display = 'block'; 
                  } else {
                      card.style.display = 'none';
                  }
              });
          });
      });
  }
});
