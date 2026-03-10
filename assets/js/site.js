const menuBtn = document.getElementById('menuBtn');
const mainNav = document.getElementById('mainNav');
const navLinks = Array.from(mainNav.querySelectorAll('a'));
const sections = Array.from(document.querySelectorAll('[data-page]'));
const toTop = document.getElementById('toTop');
const faqItems = Array.from(document.querySelectorAll('.faq-item'));
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

menuBtn?.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
  });
});

const setActiveLink = () => {
  const scrollY = window.scrollY + 140;
  let current = sections[0]?.id || 'home';

  sections.forEach(section => {
    if (scrollY >= section.offsetTop) {
      current = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
};

window.addEventListener('scroll', () => {
  setActiveLink();
  toTop.classList.toggle('show', window.scrollY > 420);
});

setActiveLink();

toTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

faqItems.forEach(item => {
  const button = item.querySelector('.faq-question');

  button?.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    faqItems.forEach(faq => faq.classList.remove('open'));

    if (!isOpen) {
      item.classList.add('open');
    }
  });
});

contactForm?.addEventListener('submit', event => {
  event.preventDefault();
  formFeedback.textContent = 'Mensagem registrada. Agora conecte este formulário ao endpoint real da sua API.';
  contactForm.reset();
});
