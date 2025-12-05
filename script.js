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
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const bar1 = document.getElementById("bar1");
  const bar2 = document.getElementById("bar2");
  const bar3 = document.getElementById("bar3");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  if (!menuBtn || !mobileMenu || !bar1 || !bar2 || !bar3) return;

  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("menu-open");
    bar1.classList.toggle("rotate-45");
    bar2.classList.toggle("opacity-0");
    bar3.classList.toggle("-rotate-45");
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("menu-open");
      bar1.classList.remove("rotate-45");
      bar2.classList.remove("opacity-0");
      bar3.classList.remove("-rotate-45");
    });
  });
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
  const productsContainer = document.getElementById("products-content");
  if (!productsContainer) return; // no estamos en calzado.html

  const searchInput = document.getElementById("static-search");
  const categoryButtons = document.querySelectorAll(".static-category-btn");
  const priceRange = document.getElementById("static-price");
  const priceValue = document.getElementById("static-price-value");
  const sizeButtons = document.querySelectorAll(".static-size-btn");
  const resetButton = document.getElementById("static-reset");
  const mobileFilterToggle = document.getElementById("static-mobile-filter-toggle");
  const sidebar = document.getElementById("static-sidebar");
  const productCards = document.querySelectorAll(".product-card");

  let state = {
    search: "",
    category: "all",
    maxPrice: priceRange ? parseFloat(priceRange.value) : Infinity,
    size: null
  };

  function applyFilters() {
    productCards.forEach(card => {
      const name = (card.dataset.name || "").toLowerCase();
      const brand = (card.dataset.brand || "").toLowerCase();
      const category = card.dataset.category || "";
      const price = parseFloat(card.dataset.price || "0");
      const sizes = (card.dataset.sizes || "").split(",").map(s => s.trim());

      const matchesSearch =
        !state.search ||
        name.includes(state.search) ||
        brand.includes(state.search);

      const matchesCategory =
        state.category === "all" || category === state.category;

      const matchesPrice = price <= state.maxPrice;

      const matchesSize =
        !state.size || sizes.includes(String(state.size));

      const visible =
        matchesSearch && matchesCategory && matchesPrice && matchesSize;

      card.classList.toggle("hidden", !visible);
    });
  }

  // 🔍 Buscar
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.search = e.target.value.toLowerCase();
      applyFilters();
    });
  }

  // 🏷 Categoría
  categoryButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.category;
      state.category = category || "all";

      categoryButtons.forEach(b => b.classList.remove("font-bold", "text-suo-green"));
      btn.classList.add("font-bold", "text-suo-green");

      applyFilters();
    });
  });

  // 💶 Precio máximo
  if (priceRange && priceValue) {
    const updatePriceLabel = () => {
      const val = parseFloat(priceRange.value);
      state.maxPrice = val;
      priceValue.textContent = `${val} €`;
      applyFilters();
    };
    priceRange.addEventListener("input", updatePriceLabel);
    updatePriceLabel();
  }

  // 👟 Talla
  sizeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const size = btn.dataset.size;

      if (state.size === size) {
        state.size = null;
      } else {
        state.size = size;
      }

      sizeButtons.forEach(b => {
        b.classList.remove("bg-suo-green", "text-white", "border-suo-green");
        b.classList.add("border-gray-200", "text-gray-600");
      });

      if (state.size) {
        btn.classList.add("bg-suo-green", "text-white", "border-suo-green");
        btn.classList.remove("border-gray-200", "text-gray-600");
      }

      applyFilters();
    });
  });

  // 🔄 Reset
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      state = {
        search: "",
        category: "all",
        maxPrice: priceRange ? parseFloat(priceRange.max) : Infinity,
        size: null
      };

      if (searchInput) searchInput.value = "";
      if (priceRange && priceValue) {
        priceRange.value = priceRange.max;
        priceValue.textContent = `${priceRange.max} €`;
      }

      categoryButtons.forEach(b => b.classList.remove("font-bold", "text-suo-green"));
      categoryButtons.forEach(b => {
        if (b.dataset.category === "all") {
          b.classList.add("font-bold", "text-suo-green");
        }
      });

      sizeButtons.forEach(b => {
        b.classList.remove("bg-suo-green", "text-white", "border-suo-green");
        b.classList.add("border-gray-200", "text-gray-600");
      });

      applyFilters();
    });
  }

  // 📱 Toggle filtros en móvil
  if (mobileFilterToggle && sidebar) {
    mobileFilterToggle.addEventListener("click", () => {
      sidebar.classList.toggle("hidden");
    });
  }

  applyFilters();
}

// --- 5️⃣ Filtros del blog ---
function initBlogFilters() {
  const filterButtons = document.querySelectorAll(".blog-filter-btn");
  const posts = document.querySelectorAll(".blog-post-card");

  if (!filterButtons.length || !posts.length) return; // no estamos en blog.html

  let currentFilter = "all";

  function applyBlogFilter() {
    posts.forEach(post => {
      const category = post.dataset.category || "";
      const visible =
        currentFilter === "all" || category === currentFilter;

      post.classList.toggle("hidden", !visible);
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter || "all";
      currentFilter = filter;

      filterButtons.forEach(b => {
        b.classList.remove("bg-suo-green", "text-white");
        b.classList.add("bg-white", "text-suo-dark");
      });

      btn.classList.remove("bg-white", "text-suo-dark");
      btn.classList.add("bg-suo-green", "text-white");

      applyBlogFilter();
    });
  });

  applyBlogFilter();
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
