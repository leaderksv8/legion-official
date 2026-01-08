export function renderActivities(data, lang) {
    const container = document.getElementById('activities-container');
    if (!container || !data) return;
    container.innerHTML = data.map(item => `
        <div class="b2-item-card">
            <div class="b2-card-inner">
                <div class="b2-card-front"><div class="b2-icon-box"><i class="fa-solid fa-${item.icon}"></i></div><h4>${item.title[lang]}</h4></div>
                <div class="b2-card-back"><p>${item.desc[lang]}</p></div>
            </div>
        </div>
    `).join('');
}

export function renderStats(data, lang) {
    const container = document.getElementById('stats-container');
    if (!container || !data) return;
    container.innerHTML = data.map(item => `<div class="b3-stat-item"><span class="b3-number" data-target="${item.value}">0</span><span class="b3-label">${item.label[lang]}</span></div>`).join('');
}

export function renderPartners(data) {
    const track = document.getElementById('partners-track');
    if (!track || !data) return;
    track.innerHTML = data.map(p => `
        <div class="swiper-slide">
            <div class="b4-item-box">
                <a href="${p.link}" target="_blank" rel="noopener"><img src="${p.img}" alt="${p.name}"></a>
            </div>
        </div>
    `).join('');
}

export function renderTeam(data, lang) {
    const container = document.getElementById('team-container');
    if (!container || !data) return;
    container.innerHTML = data.map(m => `
        <div class="b5-specialist-card">
            <div class="b5-photo-container"><img src="${m.img}" alt="${m.name}"></div>
            <h3>${m.name}</h3><span class="b5-role-badge">${m.role[lang]}</span>
            <div class="b5-social-links">
                <a href="${m.social || '#'}" target="_blank" class="b5-social-btn"><i class="fab fa-facebook-f"></i></a>
                <a href="#" class="b5-social-btn"><i class="fab fa-telegram-plane"></i></a>
            </div>
        </div>
    `).join('');
}

export function renderStories(data, lang) {
    const container = document.getElementById('stories-container');
    if (!container || !data) return;
    container.innerHTML = data.map(s => `
        <div class="b6-card">
            <div class="b6-quote-mark">“</div>
            <p class="b6-card-text">${s.text[lang]}</p>
            <div class="b6-author">
                <img src="${s.img}" class="b6-author-img" alt="${s.name}">
                <div class="b6-author-info"><h4>${s.name}</h4><p>${s.rank[lang]}</p></div>
            </div>
        </div>
    `).join('');
}

export function renderNews(data, lang) {
    const container = document.getElementById('news-container');
    if (!container || !data) return;
    container.innerHTML = data.map(n => {
        const domain = new URL(n.link).hostname.replace('www.', '').split('.')[0].toUpperCase();
        return `
            <a href="${n.link}" class="b7-news-item" target="_blank">
                <div class="b7-item-meta"><div class="b7-live-dot"></div><span class="b7-source-label">${domain} | ${n.date}</span></div>
                <h4>${n.title[lang]}</h4>
            </a>`;
    }).join('');
}

export function renderAlbums(data, lang) {
    const container = document.getElementById('albums-container');
    const fullGrid = document.getElementById('full-albums-grid');
    if (!container || !data) return;
    const html = (a) => `<div class="b7-album-tile" onclick="window.openGallery('${a.id}')"><img src="${a.preview}" alt="G"><div class="b7-album-tile-overlay"><h4>${a.title[lang]}</h4></div></div>`;
    container.innerHTML = data.slice(0, 3).map(html).join('');
    fullGrid.innerHTML = data.map(html).join('');
}