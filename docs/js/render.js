export function renderActivities(data, lang) {
    const container = document.getElementById('activities-container');
    if (!container || !data) return;
    container.innerHTML = data.map(item => `
        <div class="b2-item-card">
            <div class="b2-card-inner">
                <div class="b2-card-front">
                    <div class="b2-icon-box"><i class="fa-solid fa-${item.icon}"></i></div>
                    <h4>${item.title[lang]}</h4>
                    <div class="b2-flip-hint"><i class="fa-solid fa-rotate"></i></div>
                </div>
                <div class="b2-card-back">
                    <p>${item.desc[lang]}</p>
                </div>
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
    // 4-кратне дублювання для безшовності
    const list = [...data, ...data, ...data, ...data];
    track.innerHTML = list.map(p => `
        <a href="${p.link}" class="b4-item" target="_blank" rel="noopener">
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://placehold.co/220x100/1a2a44/ffffff?text=Partner'">
        </a>
    `).join('');
}