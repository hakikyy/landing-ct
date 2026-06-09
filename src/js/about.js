// about.js — about page micro-interactions
(function () {
    function installHeaderScroll() {
        const headerMount = document.getElementById('site-header');
        if (!headerMount) return;

        // headerMount contains the injected header; find the root element to toggle shadow on
        const headerEl = headerMount.querySelector('header') || headerMount;
        if (!headerEl) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                headerEl.classList.add('shadow-md');
            } else {
                headerEl.classList.remove('shadow-md');
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        // If header already injected by shared loader, install immediately
        if (document.getElementById('site-header')?.children.length) {
            installHeaderScroll();
            return;
        }

        // Otherwise wait for header to be injected
        const bodyObserver = new MutationObserver((mutations, obs) => {
            if (document.getElementById('site-header')?.children.length) {
                installHeaderScroll();
                obs.disconnect();
            }
        });
        bodyObserver.observe(document.body, { childList: true, subtree: true });
    });
})();
