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
    const tripledData = [...data, ...data, ...data];
    track.innerHTML = tripledData.map((p, index) => `
        <div class="swiper-slide">
            <div class="b4-item">
                <a href="${p.link}" target="_blank" rel="noopener">
                    <img src="${p.img}" alt="${p.name}" onerror="this.src='https://placehold.co/400x400/1e293b/ffffff?text=Partner'">
                </a>
            </div>
        </div>
    `).join('');
}

export function renderFriends(data, lang) {
    const container = document.getElementById('friends-container');
    if (!container || !data) return;
    container.innerHTML = data.map(f => `
        <a href="${f.link}" class="b5-link" target="_blank" rel="noopener">
            <div class="b5-card">
                <div class="b5-image-wrapper"><img src="${f.img}" alt="${f.name}"></div>
                <h3>${f.name}</h3>
                <p>${f.role[lang]}</p>
            </div>
        </a>
    `).join('');
}

export function renderStories(data, lang) {
    const container = document.getElementById('stories-container');
    if (!container || !data) return;
    container.innerHTML = data.map(s => `
        <div class="b6-card">
            <div class="b6-image-box">
                <img src="${s.img}" alt="${s.name}">
            </div>
            <div class="b6-info">
                <h3>${s.name}</h3>
                <span class="b6-rank">${s.rank[lang]}</span>
                <p class="b6-text">"${s.text[lang]}"</p>
            </div>
        </div>
    `).join('');
}