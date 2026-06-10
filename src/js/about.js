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

    const toggleBtn = document.getElementById('toggleExperts');
    const extraExperts = document.querySelectorAll('.extra-expert');

    if (toggleBtn && extraExperts.length) {
        let isExpanded = false;

        toggleBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;

            extraExperts.forEach(expert => {
                expert.classList.toggle('hidden');
            });

            toggleBtn.textContent = isExpanded
                ? 'Show Less Experts'
                : 'Show More Experts';
        });
    }
})();

const legalDocuments = [
    "24.png",
    "231.png",
    "PT-9001-1.jpg",
    "PT14001-1.jpg",
    "PT45001-1.jpg",
];

const legalMarquee = document.getElementById("legal-marquee");

if (legalMarquee) {
    legalMarquee.innerHTML = `
        <div class="flex items-center gap-8 px-8">
            ${[...legalDocuments, ...legalDocuments].map((doc, index) => `
                <div class="legal-card">
                    <img
                        src="./src/assets/images/legal-company/${doc}"
                        alt="Legal Document ${index + 1}"
                    >
                </div>
            `).join("")}
        </div>
    `;
}
