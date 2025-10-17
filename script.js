// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const bar1 = document.getElementById('bar1');
const bar2 = document.getElementById('bar2');
const bar3 = document.getElementById('bar3');
const mobileLinks = document.querySelectorAll('.mobile-link');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('menu-open');
    bar1.classList.toggle('rotate-45');
    bar2.classList.toggle('opacity-0');
    bar3.classList.toggle('-rotate-45');
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('menu-open');
        bar1.classList.remove('rotate-45');
        bar2.classList.remove('opacity-0');
        bar3.classList.remove('-rotate-45');
    });
});

// FAQ accordion
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const icon = question.querySelector('.faq-icon');

        answer.classList.toggle('hidden');
        icon.style.transform = answer.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
    });
});

// Newsletter form
document.getElementById('newsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value;
    alert(`¡Gracias por suscribirte! Te enviaremos novedades a ${email}`);
    document.getElementById('newsletterEmail').value = '';
});
styles.css
Nuevo
