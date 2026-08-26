const header = document.getElementById('site-header');
const toggle = document.querySelector('.menu-toggle');
const navLinks = document.getElementById('nav-links');
const links = [...document.querySelectorAll('.nav-links a')];

function setHeaderState() {
  header.classList.toggle('scrolled', window.scrollY > 20);
}
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

toggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

links.forEach((link) => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
}));

const sections = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
const activeObserver = new IntersectionObserver((entries) => {
  const current = entries.filter((entry) => entry.isIntersecting)
    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
  if (!current) return;
  links.forEach((link) => {
    const active = link.getAttribute('href') === `#${current.target.id}`;
    link.classList.toggle('active', active);
  });
}, { rootMargin: '-20% 0px -60% 0px' });
sections.forEach((section) => activeObserver.observe(section));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
