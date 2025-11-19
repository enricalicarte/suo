//AVATAR
<script>(function() {
  var iframe = document.createElement('iframe');
  var baseUrl = 'https://copy-of-video-avatar-configurator-622291485897.us-west1.run.app/?mode=embedded';
  iframe.src = baseUrl;
  iframe.title = 'AI Video Avatar';
  iframe.setAttribute('allow', 'microphone');
  iframe.style.cssText = 'border:none; position: fixed; bottom: 20px; right: 20px; z-index: 9999; width: 300px; height: 400px; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.2);';
  
  // 1. Configuration (Obfuscated)
  var encodedConfig = 'eyJ2aWRlb1VybCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9lbnJpY2FsaWNhcnRlL2Fzc2V0cy9yZWZzL2hlYWRzL21haW4vYXZhdGFyLWRlcm1hdHVsLm1wNCIsInN5c3RlbUluc3RydWN0aW9uIjoiQXNpc3RlbnRlIGVzcGVjaWFsaXN0YSBlbiBjYWx6YXpvIGJhcmVmb290IHBhcmEgbmnDsW9zLCBuacOxYXMgeSBtdWplcmVzLCBkYW5kbyBjb25zZWpvcyB5IHJlc29sdmllbmRvIGR1ZGFzIiwidm9pY2UiOiJaZXBoeXIifQ==';

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

  // 4. Listen for Commands from the Avatar (Navigation/Scrolling)
  window.addEventListener('message', function(event) {
    // We generally allow messages from the avatar iframe
    if (!event.data || typeof event.data !== 'object') return;

    if (event.data.type === 'AVATAR_ACTION') {
        const cmd = event.data.command;
        const args = event.data.args;

        // console.log("Avatar requested action:", cmd, args);

        if (cmd === 'scrollPage') {
            if (args.direction === 'up') window.scrollBy({ top: -500, behavior: 'smooth' });
            else if (args.direction === 'down') window.scrollBy({ top: 500, behavior: 'smooth' });
            else if (args.direction === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
            else if (args.direction === 'bottom') window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
        
        if (cmd === 'navigatePage') {
             if (args.url) {
                 window.location.href = args.url;
             }
        }
    }
  });

  document.body.appendChild(iframe);
})();</script>

// --- Cargar header y footer dinámicamente ---
function loadFragment(id, file) {
  return fetch(file)
    .then(res => res.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;
    })
    .catch(err => console.error(`Error al cargar ${file}:`, err));
}

// --- Iniciar cuando la página esté lista ---
document.addEventListener("DOMContentLoaded", async () => {
  // Espera a que se carguen header y footer antes de ejecutar el resto
  await Promise.all([
    loadFragment("header", "header.html"),
    loadFragment("footer", "footer.html")
  ]);

  // Cuando todo está cargado, inicializa los scripts
  initMenu();
  initFAQ();
  initNewsletter();
});


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

