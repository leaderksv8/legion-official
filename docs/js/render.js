export function renderActivities(data, lang) {
    const container = document.getElementById('activities-container');
    if (!container || !data.length) return;
    container.innerHTML = data.map(item => `
        <div class="b2-item-card"><div class="b2-card-inner">
            <div class="b2-card-front"><div class="b2-icon-box"><i class="fa-solid fa-${item.icon}"></i></div><h4>${item.title[lang]}</h4></div>
            <div class="b2-card-back"><p>${item.desc[lang]}</p></div>
        </div></div>
    `).join('');
}

export function renderStats(data, lang) {
    const container = document.getElementById('stats-container');
    if (!container || !data.length) return;
    container.innerHTML = data.map(item => `<div class="b3-stat-item"><span class="b3-number" data-target="${item.value}">0</span><span class="b3-label">${item.label[lang]}</span></div>`).join('');
}

export function renderPartners(data) {
    const row1 = document.getElementById('partners-row-1'), row2 = document.getElementById('partners-row-2');
    if (!row1 || !row2 || !data.length) return;
    const g1 = data.slice(0, 5), g2 = data.slice(5, 10);
    const html = (items) => items.map(p => `<div class="b4-kinetic-item"><a href="${p.link}" target="_blank" rel="noopener"><img src="${p.img}" alt="P" onerror="this.src='https://placehold.co/400x400?text=Logo'"></a></div>`).join('').repeat(4);
    row1.innerHTML = html(g1); row2.innerHTML = html(g2);
}

export function renderTeam(data, lang) {
    const container = document.getElementById('team-container');
    if (!container || !data.length) return;
    container.innerHTML = data.map(m => `
        <div class="b5-specialist-card">
            <div class="b5-photo-container"><img src="${m.img}" alt="T"></div>
            <h3>${m.name}</h3><span class="b5-role-badge">${m.role[lang]}</span>
            <div class="b5-social-links"><a href="${m.social || '#'}" target="_blank" class="b5-social-btn"><i class="fab fa-facebook-f"></i></a><a href="#" class="b5-social-btn"><i class="fab fa-telegram-plane"></i></a></div>
        </div>
    `).join('');
}

export function renderStories(data, lang) {
    const container = document.getElementById('stories-container');
    if (!container || !data.length) return;
    container.innerHTML = data.map(s => `<div class="b6-card"><div class="b6-quote-mark">“</div><p class="b6-card-text">${s.text[lang]}</p><div class="b6-author"><img src="${s.img}" class="b6-author-img" alt="H"><div class="b6-author-info"><h4>${s.name}</h4><p>${s.rank[lang]}</p></div></div></div>`).join('');
}

export function renderNews(data, lang) {
    const container = document.getElementById('news-container');
    if (!container || !data.length) return;
    container.innerHTML = data.map(n => {
        let domain = "News";
        if (n.link && n.link.includes('http')) {
            try { domain = new URL(n.link).hostname.replace('www.', '').split('.')[0].toUpperCase(); } catch(e){}
        }
        return `<a href="${n.link}" class="b7-news-item" target="_blank"><div class="b7-item-meta"><div class="b7-live-dot"></div><span class="b7-source-label">${domain} | ${n.date}</span></div><h4>${n.title[lang]}</h4></a>`;
    }).join('');
}

export function renderAlbums(data, lang) {
    const container = document.getElementById('albums-container'), fullGrid = document.getElementById('full-albums-grid');
    if (!container || !data.length) return;
    const html = (a) => `<div class="b7-album-tile" onclick="window.openGallery('${a.id}')"><img src="${a.preview}" alt="G"><h4>${a.title[lang]}</h4></div>`;
    container.innerHTML = data.slice(0, 3).map(html).join('');
    fullGrid.innerHTML = data.map(html).join('');
}

export function renderFounders(data, lang) {
    const container = document.getElementById('founders-container');
    if (!container || !data.length) return;
    container.innerHTML = data.map(f => `<div class="b8-titan-card" onclick="window.openFounderBio('${f.id}', event)"><div class="b8-img-wrap"><img src="${f.img}" alt="F" onerror="this.src='https://placehold.co/500x700?text=TITAN'"></div><div class="b8-info-box"><h4>${f.name}</h4><p>${f.role[lang]}</p></div></div>`).join('');
}