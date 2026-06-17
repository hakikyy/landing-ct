// services.js - Load data dari JSON dan render sections dinamis

(async () => {
    try {
        // 1. Load konfigurasi page & master index
        const configRes = await fetch('src/data/services-page-config.json');
        const config = await configRes.json();

        const indexRes = await fetch('src/data/services/index.json');
        const { files } = await indexRes.json();

        // 2. Load semua service files in parallel
        const dataFiles = await Promise.all(
            files.map(f => fetch(`src/data/services/${f}.json`).then(r => r.json()))
        );

        // 3. Flatten semua services
        const allServices = dataFiles.flatMap(f => f.services || []);

        // 4. Render sections
        const main = document.querySelector('main');
        const container = document.createElement('div');
        container.id = 'services-dynamic-container';

        config.sections.forEach(section => {
            // Filter services berdasarkan kategori & sertifikasi
            const sectionServices = filterServices(allServices, section);

            // Generate HTML untuk section
            const sectionHTML = generateSection(section, sectionServices);
            container.innerHTML += sectionHTML;
        });

        // 5. Insert container sebelum "Process Section"
        const processSection = document.querySelector('section[class*="border-y"]');
        if (processSection) {
            main.insertBefore(container, processSection);
        } else {
            main.appendChild(container);
        }

        // 6. Attach event listeners
        attachEventListeners();

    } catch (err) {
        console.error('Error loading services:', err);
    }
})();

/**
 * Filter services berdasarkan kategori & sertifikasi
 */
function filterServices(services, section) {
    return services.filter(s => {
        const catMatch = !section.categoryFilters ||
            section.categoryFilters.includes(s.category);
        const certMatch = !section.certificationFilters ||
            (Array.isArray(s.certifications) &&
                s.certifications.some(c => section.certificationFilters.includes(c)));
        return catMatch && certMatch;
    });
}

/**
 * Generate section HTML berdasarkan layout type
 */
function generateSection(section, services) {
    switch (section.layout) {
        case 'grid-4':
            return generateGridSection(section, services);
        case 'image-grid-3':
            return generateImageGridSection(section, services);
        case 'banner':
            return generateBannerSection(section);
        case 'banner-with-grid':
            return generateBannerWithGridSection(section, services);
        default:
            return generateGridSection(section, services);
    }
}

/**
 * Generate standard 4-column grid section
 */
function generateGridSection(section, services) {
    const cardHTML = services.slice(0, 4).map(s => generateCard(s)).join('');

    return `
        <section class="scroll-offset" id="${section.id}">
            <div class="flex items-start md:items-center gap-4 mb-8 lg:mb-12">
                <div class="h-12 w-2 bg-deep-maroon flex-shrink-0"></div>
                <div class="flex-1">
                    <h2 class="font-headline-lg text-headline-lg text-primary uppercase tracking-tight">${section.title}</h2>
                    <p class="text-secondary font-body-md mt-1">${section.description}</p>
                </div>
            </div>
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                ${cardHTML}
            </div>
        </section>
    `;
}

/**
 * Generate image grid section (ISO style dengan 3 kolom)
 */
function generateImageGridSection(section, services) {
    const isoCards = services.map((s, idx) => {
        const images = [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCMgZ8rn58kfE9sGycmIFRmV7RIEABU3s20EdEhrhdM3kWBkrJ0ogKirlU1uF1WVc5b0C1Tvw4-ZaKy5e_Izt6PY1fFZWK8S9ax50Li6_QXBlhylmr5sw7E-hZoEqfuqWz85_qUJ90PajQKgJRtlP-GJBPtLNIyvnK0-vopbYAcOvdE3XvAg3a6YVNZX7Eq-UnzLr95GXpp5QA40vFLjOs3bD70Pr3ZxdZTOND4jg8H_JNi_6_GF9_RZBCDXWgj_pixu_z788Bxsa5M',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDNflmHNjS6gyy3wK44VdeDHHKknPyJYtGcG4ine-1ymx26FESTDj0rn6vSqRSipV-Jb9Q8vjyvk8p_Gkjj4fhzexETEq9T4BQSg55tpVD1mDhrW35bLQCHMbEnIALjeRcUvCJ1snajbL2XZVI26OOoripxA0N-Yul5nSTJgfF4s7vNMA6actKullbBL_vZS19ewhcH2gM5kpJ73vzx4JKCnu8adefl_SafDdHtaV3--65WDoHeRlJXDQmfe0RtOA-spTKh1SAFNuk1',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAXH2vcSqwH5JW8kc0qjED3S4K_GI1ItSCwcbHSzSZ4-xM5EM_vDWGn7ZYAjaPGG9wjtDsBIHNb_7eAwuo9cydgzGNCpEMegEadsEqU3M8KXpSiJyZ_S7xs2zncBGG5svS8WfOzUo1iUQ3Wy02rJXQP-uVLrTzDnUD0tJFt6kV-Bz33SUaxqoaNwEF8WD34pRtS1kNymk7bG0w1y1zqraG75vPPvv47768g9mQERa68_rag7-a7cmmPdQRQJa_57yvCpjfUa3sg6pao'
        ];

        return `
            <div class="group relative overflow-hidden rounded-2xl aspect-[4/5]">
                <img alt="${s.title}"
                    class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src="${images[idx % images.length]}" />
                <div class="absolute inset-0 bg-gradient-to-t from-deep-maroon via-deep-maroon/20 to-transparent"></div>
                <div class="absolute bottom-0 left-0 p-6 lg:p-8 text-white">
                    <h3 class="font-headline-md text-headline-md mb-2">${s.title}</h3>
                    ${s.certifications && s.certifications[0] ? `
                        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${getCertBadgeClass(s.certifications[0])} font-label-md text-xs mb-4">${getCertBadgeEmoji(s.certifications[0])} ${getCertBadgeLabel(s.certifications[0])}</span>
                    ` : ''}
                    <p class="text-white/80 text-body-md mb-6">${s.description || 'Mastering ' + s.title}</p>
                    <a href="service-detail.html?id=${s.id}"
                        class="flex items-center gap-2 font-label-md text-label-md group/btn hover:gap-4 transition-all">
                        Lihat Detail
                        <span class="material-symbols-outlined group-hover/btn:translate-x-2 transition-transform">arrow_forward</span>
                    </a>
                </div>
            </div>
        `;
    }).join('');

    const badges = section.showISOBadges ? `
        <div class="flex gap-2 flex-wrap">
            ${section.isoBadges.map(b => `<span class="px-3 py-1 bg-surface-container-low rounded text-caption font-label-md text-deep-maroon">${b}</span>`).join('')}
        </div>
    ` : '';

    return `
        <section class="scroll-offset" id="${section.id}">
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 lg:mb-12 gap-6">
                <div class="flex items-start md:items-center gap-4 flex-1">
                    <div class="h-12 w-2 bg-deep-maroon flex-shrink-0"></div>
                    <div>
                        <h2 class="font-headline-lg text-headline-lg text-primary uppercase tracking-tight">${section.title}</h2>
                        <p class="text-secondary font-body-md mt-1">${section.description}</p>
                    </div>
                </div>
                ${badges}
            </div>
            <div class="grid md:grid-cols-3 gap-6 lg:gap-8">
                ${isoCards}
            </div>
        </section>
    `;
}

/**
 * Generate banner section (untuk Food Safety & Halal)
 */
function generateBannerSection(section) {
    return `
        <section class="scroll-offset" id="${section.id}">
            <div class="bg-surface-container-low rounded-3xl p-6 md:p-10 lg:p-12 overflow-hidden relative">
                <div class="relative z-10 max-w-2xl">
                    <div class="flex items-start md:items-center gap-4 mb-8 lg:mb-10">
                        <div class="h-12 w-2 bg-deep-maroon flex-shrink-0"></div>
                        <h2 class="font-headline-lg text-headline-lg text-primary uppercase tracking-tight">${section.title}</h2>
                    </div>
                    <p class="text-body-lg text-secondary mb-12">${section.description}</p>
                    <div class="grid sm:grid-cols-2 gap-8 lg:gap-10 mb-10 lg:mb-14">
                        <div class="space-y-3">
                            <h4 class="font-headline-md text-headline-md text-text-primary">Halal Certification</h4>
                            <p class="text-secondary text-body-md">End-to-end guidance for BPJPH & MUI certification standards to ensure your products meet Sharia requirements.</p>
                        </div>
                        <div class="space-y-3">
                            <h4 class="font-headline-md text-headline-md text-text-primary">FSSC 22000</h4>
                            <p class="text-secondary text-body-md">Global food safety certification combining ISO 22000 and technical specifications for sector PRPs.</p>
                        </div>
                    </div>
                    <button class="bg-deep-maroon text-on-primary px-10 py-4 rounded-lg font-label-md text-label-md hover:bg-primary shadow-lg transition-all">Get Certified Today</button>
                </div>
                <div class="absolute top-1/2 -right-20 -translate-y-1/2 hidden lg:block opacity-20">
                    <span class="material-symbols-outlined text-[400px] text-deep-maroon" style="font-variation-settings: 'FILL' 1;">${section.icon}</span>
                </div>
            </div>
        </section>
    `;
}

/**
 * Generate banner with grid section (BNSP)
 */
function generateBannerWithGridSection(section, services) {
    const gridCards = services.slice(0, 6).map((s, idx) => `
        <div class="bg-white rounded-xl p-6 shadow-sm border border-surface-variant">
            <div class="flex items-start gap-3 mb-4">
                <span class="material-symbols-outlined text-deep-maroon text-2xl flex-shrink-0">${s.icon || 'school'}</span>
                <div class="flex-1 min-w-0">
                    <h4 class="font-headline-md text-headline-md text-text-primary mb-2 leading-tight">${s.title}</h4>
                    ${s.certifications && s.certifications[0] ? `
                        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border ${getCertBadgeClass(s.certifications[0])} font-label-md text-xs">${getCertBadgeEmoji(s.certifications[0])} ${getCertBadgeLabel(s.certifications[0])}</span>
                    ` : ''}
                </div>
            </div>
            <p class="text-secondary text-body-md">${s.subtitle || ''}</p>
        </div>
    `).join('');

    const ctaBtn = section.cta ? `
        <a href="${section.cta.href}"
            class="inline-flex items-center gap-2 bg-deep-maroon text-on-primary px-10 py-4 rounded-lg font-label-md text-label-md hover:bg-primary shadow-lg transition-all">
            ${section.cta.text}
            <span class="material-symbols-outlined text-sm">${section.cta.icon}</span>
        </a>
    ` : '';

    return `
        <section class="scroll-offset" id="${section.id}">
            <div class="bg-surface-container-low rounded-3xl p-6 md:p-10 lg:p-12 overflow-hidden relative">
                <div class="absolute top-1/2 -right-16 -translate-y-1/2 hidden lg:block opacity-10">
                    <span class="material-symbols-outlined text-[360px] text-deep-maroon" style="font-variation-settings: 'FILL' 1;">${section.icon}</span>
                </div>
                <div class="relative z-10">
                    <div class="flex items-start md:items-center gap-4 mb-8 lg:mb-10">
                        <div class="h-12 w-2 bg-deep-maroon flex-shrink-0"></div>
                        <h2 class="font-headline-lg text-headline-lg text-primary uppercase tracking-tight">${section.title}</h2>
                    </div>
                    <p class="text-body-lg text-secondary mb-12 max-w-2xl">${section.description}</p>
                    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-10 lg:mb-12">
                        ${gridCards}
                        <div class="bg-white rounded-xl p-6 border-2 border-dashed border-deep-maroon/30 flex flex-col items-center justify-center text-center gap-3">
                            <span class="material-symbols-outlined text-deep-maroon text-3xl">add_circle</span>
                            <p class="text-secondary text-body-md">Skema lainnya tersedia. Konsultasikan kebutuhan sertifikasi Anda.</p>
                        </div>
                    </div>
                    ${ctaBtn}
                </div>
            </div>
        </section>
    `;
}

/**
 * Generate standard service card
 */
function generateCard(service) {
    const cert = service.certifications && service.certifications[0] ? service.certifications[0] : 'internal';
    const badgeClass = getCertBadgeClass(cert);
    const badgeLabel = getCertBadgeLabel(cert);
    const badgeEmoji = getCertBadgeEmoji(cert);

    return `
        <div data-cert="${cert}"
            class="group bg-white p-6 lg:p-8 rounded-xl border border-surface-variant hover:border-deep-maroon hover:shadow-xl hover-lift transition-all duration-500 flex flex-col justify-between gap-6 h-full">
            <div class="space-y-4">
                <div class="w-14 h-14 bg-[#8B0000]/5 rounded-lg flex items-center justify-center text-[#8B0000] mb-2 group-hover:bg-[#8B0000] group-hover:text-white transition-colors duration-300">
                    <span class="material-symbols-outlined text-2xl">${service.icon || 'school'}</span>
                </div>
                <div class="space-y-3">
                    <h3 class="font-headline-md text-headline-md text-text-primary leading-tight">${service.title}</h3>
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border ${badgeClass} font-label-md text-xs">${badgeEmoji} ${badgeLabel}</span>
                </div>
                <ul class="space-y-3">
                    ${(service.objectives || []).slice(0, 3).map(obj => `
                        <li class="flex items-start gap-2 text-secondary text-body-md leading-relaxed">
                            <span class="material-symbols-outlined text-sm mt-0.5 text-deep-maroon flex-shrink-0">check_circle</span>
                            <span>${obj}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <a href="service-detail.html?id=${service.id}"
                class="w-full py-3 px-4 rounded-lg border border-deep-maroon text-deep-maroon font-label-md text-label-md hover:bg-deep-maroon hover:text-white transition-all text-center block">
                Lihat Detail
            </a>
        </div>
    `;
}

/**
 * Helper functions untuk certification badges
 */
function getCertBadgeClass(certType) {
    const map = {
        bnsp: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        kemnaker: 'bg-red-50 border-red-200 text-red-700',
        internal: 'bg-blue-50 border-blue-200 text-blue-700'
    };
    return map[certType] || map.internal;
}

function getCertBadgeLabel(certType) {
    const map = {
        bnsp: 'BNSP Certified',
        kemnaker: 'Kemnaker RI',
        internal: 'Sertifikat Pelatihan'
    };
    return map[certType] || 'Sertifikat Pelatihan';
}

function getCertBadgeEmoji(certType) {
    const map = {
        bnsp: '🏅',
        kemnaker: '🏛️',
        internal: '📄'
    };
    return map[certType] || '📄';
}

/**
 * Attach event listeners untuk filter & interaksi
 */
function attachEventListeners() {
    // Filter buttons
    document.querySelectorAll('.cert-filter').forEach(btn => {
        btn.addEventListener('click', (e) => {
            console.log('Filter clicked:', e.target.dataset.filter);
            // TODO: Implement filter logic jika diperlukan
        });
    });

    // Hover lift animation
    document.querySelectorAll('.hover-lift').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px)';
        });
        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Certification filter logic
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.cert-filter');
    const allCards = document.querySelectorAll('[data-cert]');
    const bnspSection = document.getElementById('bnsp');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            // Update active button style
            filterBtns.forEach(b => {
                b.classList.remove(
                    'bg-deep-maroon', 'text-white', 'border-deep-maroon',
                    'bg-emerald-600', 'border-emerald-600',
                    'bg-blue-600', 'border-blue-600'
                );
                b.classList.add('border-surface-variant', 'text-secondary');
            });
            const activeClasses = {
                all: ['bg-deep-maroon', 'text-white', 'border-deep-maroon'],
                bnsp: ['bg-emerald-600', 'text-white', 'border-emerald-600'],
                kemnaker: ['bg-deep-maroon', 'text-white', 'border-deep-maroon'],
                internal: ['bg-blue-600', 'text-white', 'border-blue-600'],
            };
            btn.classList.remove('border-surface-variant', 'text-secondary');
            btn.classList.add(...(activeClasses[filter] || activeClasses.all));
            // Fade non-matching cards
            allCards.forEach(card => {
                const match = filter === 'all' || card.dataset.cert === filter;
                card.style.transition = 'opacity 0.25s, transform 0.25s';
                card.style.opacity = match ? '1' : '0.2';
                card.style.transform = match ? 'scale(1)' : 'scale(0.97)';
                card.style.pointerEvents = match ? '' : 'none';
            });
            // Handle BNSP section block (whole section fades together)
            if (bnspSection) {
                const show = filter === 'all' || filter === 'bnsp';
                bnspSection.style.transition = 'opacity 0.25s';
                bnspSection.style.opacity = show ? '1' : '0.2';
                bnspSection.style.pointerEvents = show ? '' : 'none';
            }
        });
    });
});
