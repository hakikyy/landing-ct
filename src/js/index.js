//Index.js

async function loadSharedHeader() {
    const mountPoint = document.getElementById('site-header');
    if (!mountPoint) {
        return;
    }

    try {
        const response = await fetch('src/partials/site-header.html');
        if (!response.ok) {
            throw new Error(`Failed to load shared header: ${response.status}`);
        }

        mountPoint.innerHTML = await response.text();
        setActiveNavLink();
        initMobileMenu();
    } catch (error) {
        console.warn(error);
    }
}

async function loadSharedFooter() {
    const mountPoint = document.getElementById('site-footer');
    if (!mountPoint) {
        return;
    }

    try {
        const response = await fetch('src/partials/site-footer.html');
        if (!response.ok) {
            throw new Error(`Failed to load shared footer: ${response.status}`);
        }

        mountPoint.innerHTML = await response.text();
    } catch (error) {
        console.warn(error);
    }
}

function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const normalizedPath = currentPath === '' ? 'index.html' : currentPath;
    const activeNavKeyByPath = {
        'index.html': 'home',
        'services.html': 'services',
        'about.html': 'about',
        'contact.html': 'contact',
    };

    const activeNavKey = activeNavKeyByPath[normalizedPath];

    document.querySelectorAll('[data-nav-link]').forEach(link => {
        const isActive = link.getAttribute('data-nav-link') === activeNavKey;

        link.classList.toggle('text-deep-maroon', isActive);
        link.classList.toggle('border-b-2', isActive);
        link.classList.toggle('border-deep-maroon', isActive);
        link.classList.toggle('font-bold', isActive);
        link.classList.toggle('text-on-secondary-container', !isActive);
        link.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
}

function toggleMobileMenu(forceOpen) {
    const menu = document.getElementById('mobile-menu');
    const toggleButton = document.getElementById('mobile-toggle');

    if (!menu) {
        return;
    }

    const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : menu.classList.contains('hidden');

    menu.classList.toggle('hidden', !shouldOpen);
    menu.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
    document.body.classList.toggle('overflow-hidden', shouldOpen);

    if (toggleButton) {
        toggleButton.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    }
}

function initMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const toggleButton = document.getElementById('mobile-toggle');

    if (!menu || !toggleButton) {
        return;
    }

    toggleButton.addEventListener('click', () => toggleMobileMenu());

    menu.addEventListener('click', event => {
        const target = event.target;

        if (target instanceof Element && (target.closest('[data-mobile-menu-close]') || target.closest('[data-mobile-menu-link]'))) {
            toggleMobileMenu(false);
        }
    });

    window.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            toggleMobileMenu(false);
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            toggleMobileMenu(false);
        }
    });

    window.toggleMobileMenu = toggleMobileMenu;
}

window.addEventListener('scroll', () => {
    const header = document.getElementById('site-header');
    const nav = header ? header.querySelector('header') || header : null;
    if (nav) {
        if (window.scrollY > 50) {
            nav.classList.add('bg-white/95', 'shadow-md');
            nav.classList.remove('bg-white/70');
        } else {
            nav.classList.add('bg-white/70');
            nav.classList.remove('bg-white/95', 'shadow-md');
        }
    }

    const parallaxImg = document.getElementById('parallax-img');
    if (parallaxImg && window.innerWidth > 768) {
        const scrollValue = window.scrollY;
        parallaxImg.style.transform = `translateY(${scrollValue * 0.4}px)`;
    }
});

const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.innerText = target;
            clearInterval(timer);
        } else {
            el.innerText = Math.floor(current);
        }
    }, stepTime);
}

function initRevealObserver() {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                const counters = entry.target.querySelectorAll('.stat-counter');
                counters.forEach(counter => animateCounter(counter));

                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    // Collect elements to reveal: explicit .reveal-on-scroll and common section direct children
    const revealNodes = new Set();
    document.querySelectorAll('.reveal-on-scroll').forEach(el => revealNodes.add(el));
    document.querySelectorAll('section > div').forEach(el => revealNodes.add(el));

    // Ensure each target has the base class (CSS defines initial state)
    revealNodes.forEach(el => {
        if (!el.classList.contains('reveal-on-scroll')) {
            el.classList.add('reveal-on-scroll');
        }
        revealObserver.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    Promise.all([loadSharedHeader(), loadSharedFooter()]).finally(() => {
        initRevealObserver();
    });
});

const clients = [
    "avian.png",
    "indo.svg",
    "kemenkes.svg",
    "smel.png",
    "sps.svg",
    "yamaha.png",
    "global.webp",
    "Aneka-Grafika.webp",
    "Hisamitsu.png",
    "suparma.png",
    "rum.webp",
    "Mane.webp",
    "manunggal perkasa.png",
    "sambu.png",
    "ssp.png",
    "logo-jasuindo-color.png",
];

const marquee = document.getElementById("client-marquee");

if (marquee) {
    marquee.innerHTML = `
        <div class="flex items-center gap-16 px-8">
            ${[...clients, ...clients].map((logo, index) => `
                <div class="client-logo-wrapper">
                    <img
                        src="./src/assets/images/customer/${logo}"
                        alt="Client ${index + 1}"
                    >
                </div>
            `).join("")}
        </div>
    `;
}