export function renderActivities(data, lang) {
    const container = document.getElementById('activities-container');
    if (!container || !data) return;
    container.innerHTML = data.map(item => `
        <div class="b2-item-card">
            <div class="b2-card-inner">
                <div class="b2-card-front">
                    <div class="b2-icon-box"><i class="fa-solid fa-${item.icon}"></i></div>
                    <h4>${item.title[lang]}</h4>
                </div>
                <div class="b2-card-back"><p>${item.desc[lang]}</p></div>
            </div>
        </div>
    `).join('');
}

export function renderStats(data, lang) {
    const container = document.getElementById('stats-container');
    if (!container || !data) return;
    container.innerHTML = data.map(item => `
        <div class="b3-stat-item">
            <span class="b3-number" data-target="${item.value}">0</span>
            <span class="b3-label">${item.label[lang]}</span>
        </div>
    `).join('');
}

export function renderPartners(data) {
    const track = document.getElementById('partners-track');
    if (!track || !data) return;

    // Дублюємо дані, щоб Swiper мав достатньо слайдів для нескінченного циклу на ПК
    const extendedData = [...data, ...data, ...data];

    track.innerHTML = extendedData.map(p => `
        <div class="swiper-slide">
            <div class="b4-item">
                <a href="${p.link}" target="_blank" rel="noopener" draggable="false">
                    <img src="${p.img}" alt="${p.name}" draggable="false" onerror="this.src='https://placehold.co/300x300/1a2a44/ffffff?text=Logo'">
                </a>
            </div>
        </div>
    `).join('');
}