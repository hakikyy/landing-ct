
(async () => {
    const WA_NUMBER = '628xxxxxxxxxx'; // ← ganti nomor WA di sini

    const res = await fetch('src/data/bnsp-schemes.json');
    const { categories } = await res.json();
    const totalSchemes = categories.reduce((sum, c) => sum + c.schemes.length, 0);
    document.getElementById('total-count').textContent = totalSchemes;

    // ── Config maps ──────────────────────────────────────────
    const colorMap = {
        red: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600' },
        maroon: { bg: 'bg-rose-50', border: 'border-rose-200', icon: 'text-rose-700' },
        green: { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600' },
        blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600' },
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-600' },
        orange: { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'text-orange-600' },
        purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-600' },
    };

    const certConfig = {
        bnsp: { dot: 'cert-dot-bnsp', badge: 'bg-emerald-50 border-emerald-200 text-emerald-700', label: '🏅 BNSP Certified', badgeBorder: 'border-emerald-300' },
        kemnaker: { dot: 'cert-dot-kemnaker', badge: 'bg-red-50 border-red-200 text-red-700', label: '🏛️ Kemnaker RI', badgeBorder: 'border-red-300' },
        internal: { dot: 'cert-dot-internal', badge: 'bg-blue-50 border-blue-200 text-blue-700', label: '📄 Sertifikat Pelatihan', badgeBorder: 'border-blue-300' },
    };

    // Benefits per cert type (shown in modal)
    const certBenefits = {
        bnsp: [
            'Sertifikat Kompetensi BNSP yang diakui nasional & internasional',
            'Meningkatkan kredibilitas dan nilai jual profesi',
            'Berlaku sebagai bukti kompetensi resmi di dunia industri',
            'Dapat digunakan sebagai syarat tender dan pengadaan',
        ],
        kemnaker: [
            'Lisensi / SKP resmi dari Kementerian Ketenagakerjaan RI',
            'Wajib dimiliki sesuai regulasi Permenaker',
            'Menjamin kepatuhan hukum perusahaan',
            'Diakui oleh pengawas ketenagakerjaan seluruh Indonesia',
        ],
        internal: [
            'Sertifikat Pelatihan resmi dari PT Cutting Edge Indonesia',
            'Materi sesuai standar industri terkini',
            'Cocok untuk pemenuhan kebutuhan kompetensi internal',
            'Dapat dikombinasikan dengan program sertifikasi BNSP',
        ],
    };

    // Info per category (shown in modal)
    const catInfo = {
        k3: { method: 'In-Class / In-House', provider: 'LSP K3 Indonesia' },
        pjk3: { method: 'In-Class', provider: 'Kemnaker RI' },
        environmental: { method: 'In-Class / In-House', provider: 'LSP Lingkungan Hidup' },
        kalibrasi: { method: 'In-Class', provider: 'LSP Metrologi' },
        halal: { method: 'In-Class', provider: 'LSP Halal BPJPH/MUI' },
        food: { method: 'In-Class / In-House', provider: 'LSP Keamanan Pangan' },
        sdm: { method: 'In-Class / In-House', provider: 'LSP Manajemen & SDM' },
    };

    // ── Stats row ────────────────────────────────────────────
    const statsRow = document.getElementById('stats-row');
    categories.forEach(cat => {
        statsRow.innerHTML += `
                <div class="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white font-label-md text-sm">
                    <span class="material-symbols-outlined text-sm">${cat.icon}</span>
                    ${cat.label}: <strong>${cat.schemes.length}</strong>
                </div>`;
    });

    // ── Category tabs ────────────────────────────────────────
    const tabsEl = document.getElementById('category-tabs');
    categories.forEach(cat => {
        tabsEl.innerHTML += `
                <button data-cat="${cat.id}"
                    class="cat-btn flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg border border-surface-variant text-secondary font-label-md text-sm transition-all hover:border-deep-maroon hover:text-deep-maroon">
                    <span class="material-symbols-outlined text-sm">${cat.icon}</span>
                    ${cat.label}
                    <span class="ml-1 px-1.5 py-0.5 rounded-full bg-surface-container text-xs">${cat.schemes.length}</span>
                </button>`;
    });

    // ── Render scheme cards ──────────────────────────────────
    const container = document.getElementById('schemes-container');
    categories.forEach(cat => {
        const col = colorMap[cat.color] || colorMap.blue;
        const schemesHTML = cat.schemes.map(s => {
            const cert = certConfig[s.type] || certConfig.internal;
            return `
                    <div class="scheme-item reveal-on-scroll flex items-center gap-3 p-4 bg-white rounded-xl border border-surface-variant hover:border-deep-maroon hover:shadow-md transition-all duration-200 group"
                        data-cat="${cat.id}"
                        data-catLabel="${cat.label}"
                        data-catIcon="${cat.icon}"
                        data-type="${s.type}"
                        data-name="${s.name.toLowerCase()}"
                        data-fullname="${s.name}"
                        tabindex="0"
                        role="button"
                        aria-label="Lihat detail dan daftar: ${s.name}">
                        <span class="flex-shrink-0 w-2.5 h-2.5 rounded-full ${cert.dot} inline-block"></span>
                        <p class="font-label-md text-label-md text-text-primary group-hover:text-deep-maroon transition-colors leading-snug flex-1 min-w-0">${s.name}</p>
                        <div class="flex items-center gap-2 flex-shrink-0">
                            <span class="hidden sm:inline-flex text-xs px-2 py-1 rounded-full border font-label-md ${cert.badge}">${cert.label}</span>
                            <span class="arrow-hint material-symbols-outlined text-deep-maroon text-lg">chevron_right</span>
                        </div>
                    </div>`;
        }).join('');

        container.innerHTML += `
                <section data-section="${cat.id}" class="scheme-section">
                    <div class="flex items-center gap-4 mb-6">
                        <div class="w-12 h-12 ${col.bg} border ${col.border} rounded-xl flex items-center justify-center flex-shrink-0">
                            <span class="material-symbols-outlined ${col.icon}">${cat.icon}</span>
                        </div>
                        <div>
                            <h2 class="font-headline-md text-headline-md text-primary">${cat.label}</h2>
                            <p class="text-secondary font-body-md text-sm"><span class="scheme-visible-count">${cat.schemes.length}</span> skema tersedia</p>
                        </div>
                    </div>
                    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">${schemesHTML}</div>
                </section>`;
    });

    // ── Reveal observer ──────────────────────────────────────
    const revealObs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); revealObs.unobserve(e.target); } });
    }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.reveal-on-scroll').forEach(el => revealObs.observe(el));

    // ── Modal logic ──────────────────────────────────────────
    const modal = document.getElementById('inquiry-modal');
    const backdrop = document.getElementById('modal-backdrop');
    const modalClose = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalCat = document.getElementById('modal-category');
    const modalBadge = document.getElementById('modal-cert-badge');
    const modalBenefits = document.getElementById('modal-benefits');
    const modalInfo = document.getElementById('modal-info-grid');
    const modalWA = document.getElementById('modal-wa');
    const modalContact = document.getElementById('modal-contact');

    function openModal(card) {
        const name = card.dataset.fullname;
        const type = card.dataset.type;
        const catId = card.dataset.cat;
        const catLabel = card.dataset.catlabel;

        const cert = certConfig[type] || certConfig.internal;
        const info = catInfo[catId] || { method: 'In-Class / In-House', provider: 'LSP Terkait' };
        const benefits = certBenefits[type] || certBenefits.internal;

        // Populate
        modalTitle.textContent = name;
        modalCat.textContent = catLabel;
        modalBadge.className = `inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-label-md mb-3 border ${cert.badge}`;
        modalBadge.textContent = cert.label;

        modalBenefits.innerHTML = benefits.map(b => `
                <li class="flex items-start gap-2 text-secondary font-body-md text-sm">
                    <span class="material-symbols-outlined text-emerald-600 text-sm mt-0.5 flex-shrink-0">check_circle</span>
                    ${b}
                </li>`).join('');

        modalInfo.innerHTML = `
                <div class="bg-surface-container-low rounded-xl p-4">
                    <p class="text-xs text-secondary font-label-md uppercase tracking-widest mb-1">Metode</p>
                    <p class="font-label-md text-label-md text-text-primary flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-deep-maroon text-sm">location_on</span>${info.method}
                    </p>
                </div>
                <div class="bg-surface-container-low rounded-xl p-4">
                    <p class="text-xs text-secondary font-label-md uppercase tracking-widest mb-1">Penerbit</p>
                    <p class="font-label-md text-label-md text-text-primary flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-deep-maroon text-sm">workspace_premium</span>${info.provider}
                    </p>
                </div>`;

        // WhatsApp link — name baked into message
        const waMsg = encodeURIComponent(`Halo, saya ingin mendaftar/bertanya tentang sertifikasi:\n\n*${name}*\n\nMohon informasi jadwal dan biayanya. Terima kasih.`);
        modalWA.href = `https://wa.me/${WA_NUMBER}?text=${waMsg}`;
        modalContact.href = `contact.html?service=${encodeURIComponent(name)}`;

        // Open
        modal.classList.add('open');
        document.body.classList.add('overflow-hidden');
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.classList.remove('overflow-hidden');
    }

    // Click on scheme card
    document.getElementById('schemes-container').addEventListener('click', e => {
        const card = e.target.closest('.scheme-item');
        if (card) openModal(card);
    });

    // Keyboard accessibility
    document.getElementById('schemes-container').addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            const card = e.target.closest('.scheme-item');
            if (card) { e.preventDefault(); openModal(card); }
        }
    });

    modalClose.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    // ── Filter & Search ──────────────────────────────────────
    let activeCat = 'all', activeType = 'all', searchQuery = '';

    function applyFilters() {
        const items = document.querySelectorAll('.scheme-item');
        let visibleTotal = 0;
        const sectionCounts = {};
        categories.forEach(c => sectionCounts[c.id] = 0);

        items.forEach(item => {
            const show = (activeCat === 'all' || item.dataset.cat === activeCat)
                && (activeType === 'all' || item.dataset.type === activeType)
                && (!searchQuery || item.dataset.name.includes(searchQuery));
            item.classList.toggle('hidden-item', !show);
            if (show) { visibleTotal++; sectionCounts[item.dataset.cat]++; }
        });

        document.querySelectorAll('.scheme-section').forEach(sec => {
            const count = sectionCounts[sec.dataset.section] || 0;
            sec.style.display = count === 0 ? 'none' : '';
            const el = sec.querySelector('.scheme-visible-count');
            if (el) el.textContent = count;
        });

        document.getElementById('result-count').textContent =
            (searchQuery || activeCat !== 'all' || activeType !== 'all')
                ? `Menampilkan ${visibleTotal} dari ${totalSchemes} skema`
                : `${totalSchemes} skema tersedia — klik untuk tanya / daftar`;

        document.getElementById('no-results').classList.toggle('visible', visibleTotal === 0);
        document.getElementById('schemes-container').style.display = visibleTotal === 0 ? 'none' : '';
    }

    document.getElementById('category-tabs').addEventListener('click', e => {
        const btn = e.target.closest('.cat-btn');
        if (!btn) return;
        activeCat = btn.dataset.cat;
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilters();
    });

    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            activeType = btn.dataset.type;
            document.querySelectorAll('.type-btn').forEach(b => {
                b.classList.remove('bg-deep-maroon', 'text-white', 'border-deep-maroon', 'bg-emerald-600', 'border-emerald-600', 'bg-blue-600', 'border-blue-600');
                b.classList.add('border-surface-variant', 'text-secondary');
            });
            btn.classList.remove('border-surface-variant', 'text-secondary');
            ({ all: ['bg-deep-maroon', 'text-white', 'border-deep-maroon'], bnsp: ['bg-emerald-600', 'text-white', 'border-emerald-600'], kemnaker: ['bg-deep-maroon', 'text-white', 'border-deep-maroon'], internal: ['bg-blue-600', 'text-white', 'border-blue-600'] }[activeType] || []).forEach(c => btn.classList.add(c));
            applyFilters();
        });
    });

    document.getElementById('search-input').addEventListener('input', e => {
        searchQuery = e.target.value.toLowerCase().trim();
        if (searchQuery) {
            activeCat = 'all';
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.cat-btn[data-cat="all"]').classList.add('active');
        }
        applyFilters();
    });

    applyFilters();
})();