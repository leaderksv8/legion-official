export function renderActivities(data, lang) {
    const c = document.getElementById('activities-container');
    if (!c || !data) return;
    c.innerHTML = data.map(i => `
        <div class="b2-item-card">
            <div class="b2-icon-box"><i class="fa-solid fa-${i.icon}"></i></div>
            <h4>${i.title[lang]}</h4>
            <p>${i.desc[lang]}</p>
        </div>
    `).join('');
}

export function renderStats(data, lang) {
    const c = document.getElementById('stats-container');
    if (!c || !data) return;
    c.innerHTML = data.map(i => `
        <div class="b3-stat-item">
            <span class="b3-number" data-target="${i.value}">0</span>
            <p class="b3-label">${i.label[lang]}</p>
        </div>
    `).join('');
}

export function renderPartners(data) {
    const r1 = document.getElementById('partners-row-1'), r2 = document.getElementById('partners-row-2');
    if (!r1 || !r2 || !data) return;
    const html = (items) => items.map(p => `
        <div class="b4-kinetic-item">
            <a href="${p.link}" target="_blank">
                <img src="${p.img}" alt="Partner" onerror="this.src='https://placehold.co/400x200/f8fafc/1e293b?text=Logo'">
            </a>
        </div>
    `).join('').repeat(4);
    r1.innerHTML = html(data.slice(0, 5));
    r2.innerHTML = html(data.slice(5, 10));
}

export function renderTeam(data, lang) {
    const c = document.getElementById('team-container');
    if (!c || !data) return;
    c.innerHTML = data.map(m => `
        <div class="b5-specialist-card">
            <div class="b5-photo-container"><img src="${m.img}" alt="Team"></div>
            <h3>${m.name}</h3><span class="b5-role-badge">${m.role[lang]}</span>
        </div>
    `).join('');
}

export function renderStories(data, lang) {
    const c = document.getElementById('stories-container');
    if (!c || !data) return;
    c.innerHTML = data.map(s => `
        <div class="b6-story-card">
            <div class="b6-quote">“</div>
            <p class="b6-text">${s.text[lang]}</p>
            <div class="b6-author">
                <img src="${s.img}" alt="H">
                <div><h4>${s.name}</h4><p>${s.rank[lang]}</p></div>
            </div>
        </div>
    `).join('');
}

export function renderNews(data, lang) {
    const c = document.getElementById('news-container');
    if (!c || !data) return;
    container.innerHTML = data.map(n => `
        <a href="${n.link}" class="b7-news-item" target="_blank">
            <div class="b7-news-date">${n.date}</div>
            <h4>${n.title[lang]}</h4>
        </a>
    `).join('');
}

export function renderAlbums(data, lang) {
    const c = document.getElementById('albums-container'), f = document.getElementById('full-albums-grid');
    if (!c || !data) return;
    const html = (a) => `
        <div class="b7-album-tile" onclick="window.openGallery('${a.id}')">
            <img src="${a.preview}" alt="G">
            <div class="b7-album-overlay"><h4>${a.title[lang]}</h4></div>
        </div>`;
    c.innerHTML = data.slice(0, 3).map(html).join('');
    f.innerHTML = data.map(html).join('');
}

export function renderFounders(data, lang) {
    const c = document.getElementById('founders-container');
    if (!c || !data) return;
    c.innerHTML = data.map(f => `
        <div class="b8-titan-card" onclick="window.openFounderBio('${f.id}', event)">
            <div class="b8-img-wrap"><img src="${f.img}" alt="F"></div>
            <div class="b8-info-box"><h4>${f.name}</h4><p>${f.role[lang]}</p></div>
        </div>
    `).join('');
}