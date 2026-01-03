export function renderActivities(data, lang) {
    const container = document.getElementById('activities-cards');
    if (!container) return;
    container.innerHTML = data.map(item => `
        <div class="activity-card">
            <div class="card-icon"><i class="fas fa-${item.icon}"></i></div>
            <h3>${item.title[lang]}</h3>
            <p>${item.desc[lang]}</p>
        </div>
    `).join('');
}

export function renderStats(data, lang) {
    const container = document.getElementById('stats-container');
    if (!container) return;
    container.innerHTML = data.map(item => `
        <div class="stat-item">
            <h2 class="counter" data-target="${item.value}">0</h2>
            <p>${item.label[lang]}</p>
        </div>
    `).join('');
}

export function renderFounders(data, lang) {
    const container = document.getElementById('founders-container');
    if (!container) return;
    container.innerHTML = data.map(f => `
        <div class="founder-card" onclick="openBio('${f.id}')">
            <div class="founder-img-wrapper">
                <img src="${f.img}" alt="${f.name[lang]}">
            </div>
            <h4>${f.name[lang]}</h4>
            <p>${f.role[lang]}</p>
        </div>
    `).join('');
}

export function renderNews(data, lang) {
    const container = document.getElementById('news-container');
    if (!container) return;
    container.innerHTML = data.map(n => `
        <div class="news-island">
            <div class="news-meta">
                <span class="news-tag">${n.tag[lang]}</span>
                <span class="news-date">${n.date}</span>
            </div>
            <h4>${n.title[lang]}</h4>
            <p style="font-size:0.85rem; color:#666;">${n.desc[lang]}</p>
        </div>
    `).join('');
}

export function renderPartners(data) {
    const track = document.getElementById('partners-track');
    if (!track) return;
    const double = [...data, ...data];
    track.innerHTML = double.map(p => `<img src="${p.img}" alt="${p.name}">`).join('');
}

export function renderStories(data, lang) {
    const container = document.getElementById('stories-container');
    if (!container) return;
    container.innerHTML = data.map(s => `
        <div class="story-card">
            <img src="${s.img}" alt="${s.name[lang]}">
            <div>
                <h4>${s.name[lang]}</h4>
                <p>"${s.text[lang]}"</p>
            </div>
        </div>
    `).join('');
}