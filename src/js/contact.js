// contact.js — page-specific micro-interactions
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (!menu) return;
    menu.classList.toggle('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    // Lightweight interaction for form inputs
    document.querySelectorAll('input, select, textarea').forEach(element => {
        element.addEventListener('focus', () => {
            element.parentElement.querySelector('label')?.classList.add('text-deep-maroon');
        });
        element.addEventListener('blur', () => {
            element.parentElement.querySelector('label')?.classList.remove('text-deep-maroon');
        });
    });
});

// expose to global for header button
window.toggleMobileMenu = toggleMobileMenu;
