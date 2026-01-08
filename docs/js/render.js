export function renderActivities(data, lang) {
    const container = document.getElementById('activities-container');
    if (!container || !data) return;
    container.innerHTML = data.map(item => `
        <div class="b2-item-card"><div class="b2-card-inner"><div class="b2-card-front"><div class="b2-icon-box"><i class="fa-solid fa-${item.icon}"></i></div><h4>${item.title[lang]}</h4></div><div class="b2-card-back"><p>${item.desc[lang]}</p></div></div></div>
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
    const doubledData = [...data, ...data];
    track.innerHTML = doubledData.map((p, index) => `<div class="swiper-slide"><div class="b4-item-box"><a href="${p.link}" target="_blank"><img src="${p.img}" alt="${p.name}" onerror="this.src='https://placehold.co/400x400/1e293b/ffffff?text=${(index % 10) + 1}'"></a></div></div>`).join('');
}

export function renderFriends(data, lang) {
    const container = document.getElementById('friends-container');
    if (!container || !data) return;
    container.innerHTML = data.map(f => `<a href="${f.link}" class="b5-link" target="_blank"><div class="b5-card"><div class="b5-image-wrapper"><img src="${f.img}" alt="${f.name}"></div><h3>${f.name}</h3><p>${f.role[lang]}</p></div></a>`).join('');
}

export function renderStories(data, lang) {
    const container = document.getElementById('stories-container');
    if (!container || !data) return;

    container.innerHTML = data.map(s => `
        <div class="b6-hero-card">
            <div class="b6-image-part">
                <div class="b6-image-frame">
                    <img src="${s.img}" alt="${s.name}">
                </div>
            </div>
            <div class="b6-text-part">
                <div class="b6-quote-icon">“</div>
                <h3 class="b6-hero-name">${s.name}</h3>
                <span class="b6-hero-rank">${s.rank[lang]}</span>
                <blockquote class="b6-hero-quote">
                    ${s.text[lang]}
                </blockquote>
            </div>
        </div>
    `).join('');
}

export function renderNews(data, lang) {
    const container = document.getElementById('news-container');
    if (!container || !data) return;
    container.innerHTML = data.map(n => {
        const domain = new URL(n.link).hostname.replace('www.', '').split('.')[0].toUpperCase();
        return `<a href="${n.link}" class="b7-news-item" target="_blank" rel="noopener noreferrer"><div class="b7-item-meta"><div class="b7-live-dot"></div><span class="b7-source-label">${domain} | ${n.date}</span></div><h4>${n.title[lang]}</h4></a>`;
    }).join('');
}

export function renderAlbums(data, lang) {
    const container = document.getElementById('albums-container');
    const fullGrid = document.getElementById('full-albums-grid');
    if (!container || !data) return;
    const html = (a) => `<div class="b7-album-tile" onclick="window.openGallery('${a.id}')"><img src="${a.preview}" alt="Gallery"><div class="b7-album-tile-overlay"><h4>${a.title[lang]}</h4></div></div>`;
    container.innerHTML = data.slice(0, 3).map(html).join('');
    fullGrid.innerHTML = data.map(html).join('');
}