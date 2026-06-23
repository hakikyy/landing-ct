// Transform bnsp-schemes.json to services format
const fs = require('fs');

const rawData = JSON.parse(fs.readFileSync('src/data/bnsp-schemes.json', 'utf-8'));

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);
}

const certConfig = {
  bnsp: { label: '🏅 BNSP Certified', badge: 'BNSP Certified' },
  kemnaker: { label: '🏛️ Kemnaker RI', badge: 'Kemnaker Certified' },
  internal: { label: '📄 Sertifikat Pelatihan', badge: 'Training Certificate' },
};

const catInfo = {
  k3: { method: 'In-Class / In-House', provider: 'LSP K3 Indonesia', categoryLabel: 'K3 & Keselamatan Kerja' },
  pjk3: { method: 'In-Class', provider: 'Kemnaker RI', categoryLabel: 'Pembinaan K3 / PJK3' },
  environmental: { method: 'In-Class / In-House', provider: 'LSP Lingkungan Hidup', categoryLabel: 'Lingkungan Hidup' },
  kalibrasi: { method: 'In-Class', provider: 'LSP Metrologi', categoryLabel: 'Kalibrasi & Metrologi' },
  halal: { method: 'In-Class', provider: 'LSP Halal', categoryLabel: 'Jaminan Halal' },
  food: { method: 'In-Class / In-House', provider: 'LSP Keamanan Pangan', categoryLabel: 'Keamanan Pangan' },
  sdm: { method: 'In-Class / In-House', provider: 'LSP Manajemen & SDM', categoryLabel: 'SDM & Soft Skills' },
};

const services = [];

rawData.categories.forEach(cat => {
  cat.schemes.forEach(scheme => {
    const slug = slugify(scheme.name);
    const cert = certConfig[scheme.type] || certConfig.internal;
    const info = catInfo[cat.id] || { method: 'In-Class', provider: 'LSP Terkait', categoryLabel: cat.label };
    
    services.push({
      id: `bnsp-${slug}`,
      category: cat.id,
      categoryLabel: info.categoryLabel,
      badge: cert.badge,
      certifications: [scheme.type],
      title: scheme.name,
      subtitle: `Sertifikasi ${cert.badge}`,
      icon: 'verified',
      duration: '3-5 Hari',
      method: info.method,
      certificate: `Sertifikat ${cert.badge}`,
      level: 'Profesional',
      description: `Program pelatihan ${scheme.name} dengan standar kompetensi yang diakui. Peserta yang lulus akan mendapatkan sertifikat resmi.`,
      objectives: [
        `Memahami kompetensi ${scheme.name}`,
        'Menguasai implementasi praktis di lapangan',
        `Lulus uji kompetensi ${cert.badge}`,
        `Mendapatkan sertifikat ${cert.badge}`
      ],
      syllabus: [
        { title: 'Pengantar Kompetensi', topics: ['Standar kompetensi nasional', 'Regulasi terkait', 'Persyaratan umum'] },
        { title: 'Implementasi Praktis', topics: ['Studi kasus', 'Demo lapangan', 'Latihan terstruktur'] },
        { title: 'Persiapan Uji Kompetensi', topics: ['Tipe-tipe soal', 'Teknik menjawab', 'Review materi'] }
      ],
      includes: [
        `Modul pelatihan ${scheme.name}`,
        'Biaya uji kompetensi',
        `Sertifikat ${cert.badge} (jika lulus)`,
        'Konsumsi & akomodasi',
        'Akses materi digital'
      ],
      targetParticipants: `Profesional, teknisi, dan praktisi yang ingin menguasai kompetensi ${scheme.name}.`,
      brochureUrl: '#',
      contactUrl: 'contact.html'
    });
  });
});

// Read existing bnsp.json and merge
const existing = JSON.parse(fs.readFileSync('src/data/services/bnsp.json', 'utf-8'));
const merged = {
  _meta: existing._meta,
  services: [...services, ...existing.services]
};

console.log(`Generated ${services.length} services from bnsp-schemes`);
console.log(JSON.stringify(merged, null, 2));
