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



const contactDefault = document.getElementById('contact-default');
const contactPanel = document.getElementById('contact-form-panel');
const contactOpen = document.getElementById('contact-open');
const contactBack = document.getElementById('contact-back');
const contactFormTitle = document.getElementById('contact-form-title');

function showContactForm() {
  if (!contactDefault || !contactPanel) return;
  contactDefault.hidden = true;
  contactPanel.hidden = false;
  contactFormTitle?.focus?.();
  contactPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showContactOptions() {
  if (!contactDefault || !contactPanel) return;
  contactPanel.hidden = true;
  contactDefault.hidden = false;
  contactOpen?.focus();
  contactDefault.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

contactOpen?.addEventListener('click', showContactForm);
contactBack?.addEventListener('click', showContactOptions);

const contactForm = document.getElementById('contact-form');
const contactSubmit = document.getElementById('contact-submit');
const formStatus = document.getElementById('form-status');

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const data = new FormData(contactForm);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const subject = String(data.get('subject') || '').trim();
  const message = String(data.get('message') || '').trim();
  const honey = String(data.get('_honey') || '').trim();

  if (honey) return;

  if (contactSubmit) {
    contactSubmit.disabled = true;
    contactSubmit.textContent = 'Sending...';
  }
  if (formStatus) {
    formStatus.textContent = '';
    formStatus.className = 'form-status';
  }

  try {
    const response = await fetch('https://formsubmit.co/ajax/gomomoazile68@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
        _subject: `Portfolio message: ${subject}`,
        _template: 'table'
      })
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success === 'false' || result.success === false) {
      throw new Error(result.message || 'Message could not be sent.');
    }

    contactForm.reset();
    if (formStatus) {
      formStatus.textContent = 'Message sent. Thank you, I’ll get back to you as soon as I can.';
      formStatus.classList.add('success');
    }
  } catch (error) {
    if (formStatus) {
      formStatus.textContent = 'The message could not be sent right now. Please try again or use the email link above.';
      formStatus.classList.add('error');
    }
  } finally {
    if (contactSubmit) {
      contactSubmit.disabled = false;
      contactSubmit.textContent = 'Send message';
    }
  }
});
