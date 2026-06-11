// service-detail.js
// Reads ?id= from URL, fetches service data from JSON, renders the detail page.

async function loadServiceDetail() {
    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get('id');

    const container = document.getElementById('service-detail-content');
    const skeletonEl = document.getElementById('service-detail-skeleton');

    if (!serviceId) {
        renderError(container, skeletonEl, 'No service specified.', true);
        return;
    }

    try {
        const res = await fetch('src/data/services.json');
        if (!res.ok) throw new Error('Failed to load service data');
        const { services } = await res.json();

        const service = services.find(s => s.id === serviceId);

        if (!service) {
            renderError(container, skeletonEl, `Service "${serviceId}" not found.`, true);
            return;
        }

        // Update page <title>
        document.title = `${service.title} | PT Cutting Edge Indonesia`;

        // Update breadcrumb
        const breadcrumbName = document.getElementById('breadcrumb-service-name');
        if (breadcrumbName) breadcrumbName.textContent = service.title;

        // Hide skeleton, render content
        if (skeletonEl) skeletonEl.remove();
        container.innerHTML = buildDetailHTML(service);
        container.classList.remove('hidden');

        // Re-run reveal animations on newly injected content
        initRevealObserver();

    } catch (err) {
        renderError(container, skeletonEl, 'Gagal memuat data. Silakan coba lagi.', false);
        console.error(err);
    }
}

function renderError(container, skeletonEl, message, showBack) {
    if (skeletonEl) skeletonEl.remove();
    if (!container) return;
    container.classList.remove('hidden');
    container.innerHTML = `
        <div class="max-w-container-max mx-auto px-margin-desktop py-32 text-center">
            <span class="material-symbols-outlined text-6xl text-deep-maroon mb-4 block">error_outline</span>
            <h2 class="font-headline-lg text-headline-lg text-text-primary mb-4">${message}</h2>
            ${showBack ? `<a href="services.html" class="inline-flex items-center gap-2 mt-6 bg-deep-maroon text-white px-8 py-4 rounded-lg font-label-md hover:bg-primary transition-all">
                <span class="material-symbols-outlined">arrow_back</span> Back to Services
            </a>` : ''}
        </div>
    `;
}

function buildDetailHTML(s) {
    const syllabusHTML = s.syllabus.map((module, i) => `
        <div class="reveal-on-scroll bg-white rounded-xl border border-surface-variant hover:border-deep-maroon hover:shadow-md transition-all duration-300 overflow-hidden">
            <button
                class="w-full flex items-center justify-between p-5 lg:p-6 text-left gap-4 accordion-toggle"
                aria-expanded="false"
            >
                <div class="flex items-center gap-4">
                    <span class="w-8 h-8 rounded-full bg-deep-maroon/10 text-deep-maroon font-headline-md text-sm flex items-center justify-center font-bold flex-shrink-0">
                        ${String(i + 1).padStart(2, '0')}
                    </span>
                    <span class="font-headline-md text-headline-md text-text-primary text-base">${module.title}</span>
                </div>
                <span class="material-symbols-outlined text-deep-maroon accordion-icon transition-transform duration-300">expand_more</span>
            </button>
            <div class="accordion-body hidden px-6 pb-5">
                <ul class="space-y-2 border-t border-surface-variant pt-4">
                    ${module.topics.map(t => `
                        <li class="flex items-start gap-2 text-secondary text-body-md">
                            <span class="material-symbols-outlined text-sm mt-1 text-deep-maroon">check_circle</span>
                            ${t}
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `).join('');

    const objectivesHTML = s.objectives.map(o => `
        <li class="flex items-start gap-3">
            <span class="material-symbols-outlined text-deep-maroon mt-0.5 flex-shrink-0">task_alt</span>
            <span class="text-secondary text-body-md">${o}</span>
        </li>
    `).join('');

    const includesHTML = s.includes.map(inc => `
        <li class="flex items-start gap-2 text-secondary text-body-md">
            <span class="material-symbols-outlined text-sm mt-1 text-deep-maroon">check</span>
            ${inc}
        </li>
    `).join('');

    return `
        <!-- Hero -->
        <section class="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-deep-maroon">
            <div class="absolute inset-0 opacity-10"
                style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 40px 40px;"></div>
            <div class="relative z-10 max-w-container-max mx-auto px-4 sm:px-6 lg:px-margin-desktop w-full text-white py-20 lg:py-28">
                <div class="max-w-3xl">
                    <div class="flex flex-wrap items-center gap-3 mb-6">
                        <a href="services.html" class="inline-flex items-center gap-1 text-white/60 hover:text-white font-label-md text-label-md transition-colors">
                            <span class="material-symbols-outlined text-sm">arrow_back</span>
                            Services
                        </a>
                        <span class="text-white/30">/</span>
                        <span class="text-white/60 font-label-md text-label-md">${s.categoryLabel}</span>
                        <span class="text-white/30">/</span>
                        <span class="text-white font-label-md text-label-md">${s.title}</span>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 font-label-md text-label-md mb-5 tracking-widest uppercase">
                        ${s.badge}
                    </span>
                    <h1 class="font-display-lg text-display-lg mb-4 leading-tight">${s.title}</h1>
                    <p class="font-body-lg text-body-lg text-white/80 mb-10">${s.subtitle}</p>
                    <!-- Quick Info Pills -->
                    <div class="flex flex-wrap gap-3">
                        <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 font-label-md text-label-md">
                            <span class="material-symbols-outlined text-sm">schedule</span>
                            ${s.duration}
                        </span>
                        <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 font-label-md text-label-md">
                            <span class="material-symbols-outlined text-sm">location_on</span>
                            ${s.method}
                        </span>
                        <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 font-label-md text-label-md">
                            <span class="material-symbols-outlined text-sm">workspace_premium</span>
                            ${s.certificate}
                        </span>
                        <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 font-label-md text-label-md">
                            <span class="material-symbols-outlined text-sm">signal_cellular_alt</span>
                            ${s.level}
                        </span>
                    </div>
                </div>
            </div>
        </section>
        <!-- Main Content -->
        <div class="max-w-container-max mx-auto px-4 sm:px-6 lg:px-margin-desktop py-16 lg:py-section-gap">
            <div class="grid lg:grid-cols-3 gap-10 lg:gap-16 items-start">
                <!-- Left: Main Info -->
                <div class="lg:col-span-2 space-y-14">
                    <!-- Description -->
                    <div class="reveal-on-scroll">
                        <h2 class="font-headline-lg text-headline-lg text-primary mb-5">Tentang Program</h2>
                        <p class="font-body-lg text-body-lg text-secondary leading-relaxed">${s.description}</p>
                    </div>
                    <!-- Objectives -->
                    <div class="reveal-on-scroll">
                        <h2 class="font-headline-lg text-headline-lg text-primary mb-6">Tujuan Pelatihan</h2>
                        <ul class="space-y-4">${objectivesHTML}</ul>
                    </div>
                    <!-- Syllabus Accordion -->
                    <div class="reveal-on-scroll">
                        <h2 class="font-headline-lg text-headline-lg text-primary mb-6">Silabus &amp; Materi</h2>
                        <div class="space-y-3">${syllabusHTML}</div>
                    </div>
                    <!-- Target Participants -->
                    <div class="reveal-on-scroll bg-surface-container-low rounded-2xl p-6 lg:p-8 border border-surface-variant">
                        <div class="flex items-center gap-3 mb-4">
                            <span class="material-symbols-outlined text-deep-maroon text-3xl">groups</span>
                            <h3 class="font-headline-md text-headline-md text-primary">Target Peserta</h3>
                        </div>
                        <p class="text-secondary text-body-lg">${s.targetParticipants}</p>
                    </div>
                </div>
                <!-- Right: Sticky Sidebar -->
                <div class="lg:sticky lg:top-28 space-y-6">
                    <!-- Inquiry Card -->
                    <div class="reveal-on-scroll bg-white rounded-2xl border border-surface-variant shadow-lg overflow-hidden">
                        <div class="bg-deep-maroon p-6 text-white">
                            <h3 class="font-headline-md text-headline-md mb-1">Daftar Sekarang</h3>
                            <p class="text-white/70 text-body-md">Hubungi kami untuk jadwal & penawaran terbaik</p>
                        </div>
                        <div class="p-6 space-y-4">
                            <a href="${s.contactUrl}?service=${s.id}"
                                class="w-full flex items-center justify-center gap-2 bg-deep-maroon text-white px-6 py-4 rounded-lg font-label-md text-label-md hover:bg-primary hover:shadow-xl transition-all">
                                <span class="material-symbols-outlined">support_agent</span>
                                Hubungi Konsultan
                            </a>
                            <a href="https://wa.me/628xxxxxxxxxx?text=Halo%2C%20saya%20ingin%20bertanya%20tentang%20pelatihan%20${encodeURIComponent(s.title)}" target="_blank"
                                class="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-4 rounded-lg font-label-md text-label-md hover:bg-green-700 transition-all">
                                <span class="material-symbols-outlined">chat</span>
                                WhatsApp Kami
                            </a>
                        <button
                            type="button"
                            onclick="openBrochureModal('${s.brochureUrl}')"
                            class="w-full flex items-center justify-center gap-2 border border-deep-maroon text-deep-maroon px-6 py-4 rounded-lg font-label-md text-label-md hover:bg-deep-maroon hover:text-white transition-all">
                            <span class="material-symbols-outlined">visibility</span>
                            Lihat Gambar
                        </button>
                        </div>
                    </div>
                    <!-- What's Included -->
                    <div class="reveal-on-scroll bg-surface-container-low rounded-2xl p-6 border border-surface-variant">
                        <h3 class="font-headline-md text-headline-md text-primary mb-5 flex items-center gap-2">
                            <span class="material-symbols-outlined text-deep-maroon">inventory_2</span>
                            Yang Sudah Termasuk
                        </h3>
                        <ul class="space-y-3">${includesHTML}</ul>
                    </div>
                </div>
            </div>
        </div>
        <!-- CTA Section -->
        <section class="bg-deep-maroon py-16 lg:py-20 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div class="max-w-container-max mx-auto px-4 sm:px-6 lg:px-margin-desktop relative z-10 text-center text-white">
                <h2 class="font-display-lg text-display-lg mb-6">Siap Meningkatkan Kompetensi?</h2>
                <p class="text-body-lg opacity-80 max-w-xl mx-auto mb-10">Tim konsultan kami siap membantu Anda memilih program yang tepat sesuai kebutuhan perusahaan.</p>
                <div class="flex flex-col sm:flex-row justify-center gap-4">
                    <a href="${s.contactUrl}" class="bg-white text-deep-maroon px-10 py-4 rounded-lg font-label-md text-label-md hover:shadow-2xl transition-all font-bold">Konsultasi Gratis</a>
                    <a href="services.html" class="border border-white/40 text-white px-10 py-4 rounded-lg font-label-md text-label-md hover:bg-white/10 transition-all">Lihat Layanan Lain</a>
                </div>
            </div>
        </section>
    <!-- Brochure Modal -->
<div id="brochure-modal"
    class="fixed inset-0 bg-black/80 z-[9999] hidden items-center justify-center p-4">

    <div class="relative max-w-4xl w-full">

        <!-- Tombol Close -->
        <button onclick="closeBrochureModal()"
            class="absolute -top-12 right-0 text-white hover:text-gray-300">
            <span class="material-symbols-outlined text-4xl">close</span>
        </button>

        <!-- Gambar -->
        <img id="brochure-image"
            src=""
            alt="Brochure Preview"
            class="w-full max-h-[90vh] object-contain rounded-xl shadow-2xl bg-white">
    </div>
</div>
    `;
}

// Accordion interaction
function initAccordions() {
    document.addEventListener('click', e => {
        const toggle = e.target.closest('.accordion-toggle');
        if (!toggle) return;

        const body = toggle.nextElementSibling;
        const icon = toggle.querySelector('.accordion-icon');
        const isOpen = !body.classList.contains('hidden');

        body.classList.toggle('hidden', isOpen);
        icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
        toggle.setAttribute('aria-expanded', String(!isOpen));
    });
}

// Reusable reveal observer (same logic as index.js)
function initRevealObserver() {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
}

/*Brosur Modal Logic*/

function openBrochureModal(imageUrl) {
    const modal = document.getElementById('brochure-modal');
    const image = document.getElementById('brochure-image');

    image.src = imageUrl;
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    document.body.style.overflow = 'hidden';
}

function closeBrochureModal() {
    const modal = document.getElementById('brochure-modal');

    modal.classList.add('hidden');
    modal.classList.remove('flex');

    document.body.style.overflow = '';
}

// Tutup modal ketika klik area gelap
document.getElementById('brochure-modal')?.addEventListener('click', function (e) {
    if (e.target === this) {
        closeBrochureModal();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadServiceDetail();
    initAccordions();
});