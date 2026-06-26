const DATA_URL = "src/data/services/jadwal-training.json";

const trainingListEl = document.getElementById("trainingList");
const templateEl = document.getElementById("trainingCardTemplate");
const resultsCountEl = document.getElementById("resultsCount");
const emptyStateEl = document.getElementById("emptyState");

const searchInputEl = document.getElementById("searchInput");
const filterCategoryEl = document.getElementById("filterCategory");
const filterModeEl = document.getElementById("filterMode");
const filterLocationEl = document.getElementById("filterLocation");
const resetFiltersEl = document.getElementById("resetFilters");

let allTrainings = [];

function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(date);
}

function createUniqueOptions(data, key) {
    return [...new Set(data.map(item => item[key]).filter(Boolean))].sort();
}

function fillSelectOptions(selectEl, values, defaultLabel) {
    selectEl.innerHTML = `<option value="">${defaultLabel}</option>`;
    values.forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        selectEl.appendChild(option);
    });
}

function getStatusClass(status) {
    const normalized = status.toLowerCase();
    if (normalized === "tersedia") return "status-tersedia";
    if (normalized === "hampir penuh") return "status-hampir-penuh";
    if (normalized === "closed") return "status-closed";
    return "";
}

function renderTrainings(data) {
    trainingListEl.innerHTML = "";

    if (!data.length) {
        emptyStateEl.classList.remove("hidden");
        resultsCountEl.textContent = "0 jadwal training ditemukan.";
        return;
    }

    emptyStateEl.classList.add("hidden");
    resultsCountEl.textContent = `${data.length} jadwal training ditemukan.`;

    data.forEach(item => {
        const fragment = templateEl.content.cloneNode(true);

        fragment.querySelector(".category-badge").textContent = item.category;
        const statusBadge = fragment.querySelector(".status-badge");
        statusBadge.textContent = item.status;
        statusBadge.classList.add(getStatusClass(item.status));

        fragment.querySelector(".training-title").textContent = item.title;
        fragment.querySelector(".training-description").textContent = item.description;
        fragment.querySelector(".training-date").textContent = formatDate(item.date);
        fragment.querySelector(".training-duration").textContent = item.duration;
        fragment.querySelector(".training-location").textContent = item.location;
        fragment.querySelector(".training-mode").textContent = item.mode;
        fragment.querySelector(".training-price").textContent = item.price;
        fragment.querySelector(".training-quota").textContent = `${item.quota} peserta`;

        fragment.querySelector(".btn-detail").href = item.link_detail || "#";
        fragment.querySelector(".btn-register").href = item.link_register || "#";
        fragment.querySelector(".btn-brochure").href = item.link_brochure || "#";

        trainingListEl.appendChild(fragment);
    });
}

function applyFilters() {
    const keyword = searchInputEl.value.trim().toLowerCase();
    const category = filterCategoryEl.value;
    const mode = filterModeEl.value;
    const location = filterLocationEl.value;

    const filtered = allTrainings.filter(item => {
        const matchesKeyword =
            item.title.toLowerCase().includes(keyword) ||
            item.description.toLowerCase().includes(keyword) ||
            item.category.toLowerCase().includes(keyword);

        const matchesCategory = !category || item.category === category;
        const matchesMode = !mode || item.mode === mode;
        const matchesLocation = !location || item.location === location;

        return matchesKeyword && matchesCategory && matchesMode && matchesLocation;
    });

    renderTrainings(filtered);
}

function bindEvents() {
    searchInputEl.addEventListener("input", applyFilters);
    filterCategoryEl.addEventListener("change", applyFilters);
    filterModeEl.addEventListener("change", applyFilters);
    filterLocationEl.addEventListener("change", applyFilters);

    resetFiltersEl.addEventListener("click", () => {
        searchInputEl.value = "";
        filterCategoryEl.value = "";
        filterModeEl.value = "";
        filterLocationEl.value = "";
        applyFilters();
    });
}

async function initTrainingPage() {
    try {
        const response = await fetch(DATA_URL);
        if (!response.ok) {
            throw new Error("Gagal memuat data training");
        }

        const data = await response.json();
        allTrainings = data;

        fillSelectOptions(
            filterCategoryEl,
            createUniqueOptions(allTrainings, "category"),
            "Semua Kategori"
        );

        fillSelectOptions(
            filterModeEl,
            createUniqueOptions(allTrainings, "mode"),
            "Semua Mode"
        );

        fillSelectOptions(
            filterLocationEl,
            createUniqueOptions(allTrainings, "location"),
            "Semua Lokasi"
        );

        renderTrainings(allTrainings);
        bindEvents();
    } catch (error) {
        trainingListEl.innerHTML = "";
        emptyStateEl.classList.remove("hidden");
        emptyStateEl.innerHTML = `
      <h3>Data gagal dimuat</h3>
      <p>Pastikan file JSON tersedia di path <code>${DATA_URL}</code> dan halaman dijalankan melalui local server.</p>
    `;
        resultsCountEl.textContent = "Terjadi kesalahan saat memuat data.";
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", initTrainingPage);