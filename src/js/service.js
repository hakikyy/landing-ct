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
