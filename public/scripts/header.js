const toggle = document.getElementById('menu-toggle');
const overlay = document.getElementById('mobile-overlay');
const backdrop = document.getElementById('mobile-backdrop');
const body = document.body;

function closeMenu() {
    toggle?.classList.remove('is-active');
    overlay?.classList.remove('is-open');
    backdrop?.classList.remove('is-open');
    body.style.overflow = '';
    toggle?.setAttribute('aria-expanded', 'false');
}

toggle?.addEventListener('click', () => {
    const isOpen = toggle.classList.contains('is-active');
    toggle.classList.toggle('is-active');
    overlay?.classList.toggle('is-open');
    backdrop?.classList.toggle('is-open');
    body.style.overflow = isOpen ? '' : 'hidden';
    toggle.setAttribute('aria-expanded', String(!isOpen));
});

backdrop?.addEventListener('click', closeMenu);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
});

overlay?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        closeMenu();
    });
});

// Submenu toggles (desktop + mobile)
document.querySelectorAll('.nav-dropdown-toggle, .mobile-submenu-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const parent = btn.closest('.nav-dropdown') || btn.closest('li');
        const isOpen = parent.classList.contains('submenu-open');

        // Close other open dropdowns at the same level
        parent.parentElement.querySelectorAll('.submenu-open').forEach(el => {
            el.classList.remove('submenu-open');
            el.querySelector('[aria-expanded]')?.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
            parent.classList.add('submenu-open');
            btn.setAttribute('aria-expanded', 'true');
        }
    });
});

// Close desktop dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
        document.querySelectorAll('.nav-dropdown.submenu-open').forEach(el => {
            el.classList.remove('submenu-open');
            el.querySelector('[aria-expanded]')?.setAttribute('aria-expanded', 'false');
        });
    }
});

const header = document.getElementById('site-header');
let lastScrollY = window.scrollY;
if (window.scrollY > 50) header?.classList.add('scrolled');
window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    header?.classList.toggle('scrolled', currentY > 50);
    if (currentY > 100 && currentY > lastScrollY) {
        header?.classList.add('header-hidden');
    } else {
        header?.classList.remove('header-hidden');
    }
    lastScrollY = currentY;
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinksEls = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinksEls.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}, { rootMargin: '-40% 0px -60% 0px' });

sections.forEach(section => observer.observe(section));
