

// --- Cargar header y footer dinámicamente ---
function loadFragment(id, file) {
  return fetch(file)
    .then(res => res.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;
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

  if (!menuBtn) return;

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
  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const answer = question.nextElementSibling;
      const icon = question.querySelector(".faq-icon");

      answer.classList.toggle("hidden");
      icon.style.transform = answer.classList.contains("hidden")
        ? "rotate(0deg)"
        : "rotate(180deg)";
    });
  });
}

// --- 3️⃣ Formulario de newsletter ---
function initNewsletter() {
  const form = document.getElementById("newsletterForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletterEmail").value;
    alert(`¡Gracias por suscribirte! Te enviaremos novedades a ${email}`);
    document.getElementById("newsletterEmail").value = "";
  });
}

// --- Función de inicialización ---
async function initAll() {
  // Espera a que se carguen header y footer antes de ejecutar el resto
  await Promise.all([
    loadFragment("header", "/header.html"),
    loadFragment("footer", "/footer.html")
  ]);

  // Cuando todo está cargado, inicializa los scripts
  initMenu();
  initFAQ();
  initNewsletter();
}

// --- Iniciar cuando la página esté lista ---
// Como el script se carga con defer, verificamos si el DOM ya está listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  // El DOM ya está listo, ejecuta directamente
  initAll();
}


