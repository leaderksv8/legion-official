export function renderActivities(data, lang) {
    const container = document.getElementById('activities-cards');
    if (!container || !data) return;
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
    if (!container || !data) return;
    container.innerHTML = data.map(item => `
        <div class="stat-item">
            <h2 class="counter" data-target="${item.value}">0</h2>
            <p>${item.label[lang]}</p>
        </div>
    `).join('');
}

export function renderFounders(data, lang) {
    const container = document.getElementById('founders-container');
    if (!container || !data) return;
    container.innerHTML = data.map(f => `
        <div class="founder-card" onclick="openBio('${f.id}')">
            <div class="founder-img-wrapper"><img src="${f.img}" alt="${f.name[lang]}"></div>
            <h4>${f.name[lang]}</h4>
            <p style="color:var(--accent); font-weight:700;">${f.role[lang]}</p>
        </div>
    `).join('');
}

export function renderNews(data, lang) {
    const container = document.getElementById('news-container');
    if (!container || !data) return;
    const list = [...data, ...data];
    container.innerHTML = list.map(n => `
        <div class="news-card">
            <div style="display:flex; justify-content:space-between;">
                <span style="background:var(--primary); color:white; padding:2px 10px; border-radius:50px; font-size:0.7rem;">${n.tag[lang]}</span>
                <span style="color:var(--gray); font-size:0.7rem;">${n.date}</span>
            </div>
            <h4 style="margin-top:10px;">${n.title[lang]}</h4>
            <p style="font-size:0.8rem; margin-top:5px;">${n.desc[lang]}</p>
        </div>
    `).join('');
}

// 1. ПАРТНЕРИ (КВАДРАТИ)
export function renderPartners(data) {
    const track = document.getElementById('partners-track');
    if (!track || !data) return;
    const list = [...data, ...data, ...data];
    track.innerHTML = list.map(p => `
        <a href="${p.link || '#'}" target="_blank" class="partner-square-card">
            <img src="${p.img || 'https://via.placeholder.com/150'}" alt="${p.name}">
        </a>
    `).join('');
}

// 2. ДРУЗІ (КРУЖЕЧКИ)
export function renderFriends(data, lang) {
    const container = document.getElementById('friends-container');
    if (!container || !data) return;
    container.innerHTML = data.map(f => `
        <div class="friend-circle-card" onclick="openFriendDetail('${f.id}')">
            <img src="${f.img}" alt="${f.name}">
            <div class="friend-mini-info"><h4>${f.name}</h4></div>
        </div>
    `).join('');
}

export function renderStories(data, lang) {
    const container = document.getElementById('stories-container');
    if (!container || !data) return;
    container.innerHTML = data.map(s => `
        <div class="story-card"><img src="${s.img}" alt="${s.name[lang]}" style="width:60px;height:60px;border-radius:50%;object-fit:cover;"><div style="text-align:left;"><h4>${s.name[lang]}</h4><p style="font-style:italic; font-size:0.85rem;">"${s.text[lang]}"</p></div></div>
    `).join('');
}

export function renderGallery(data) {
    const container = document.getElementById('gallery-preview');
    if (!container || !data) return;
    const list = [...data, ...data];
    container.innerHTML = list.map(img => `
        <div class="gallery-item album-card" onclick="openFullImage('${img}')">
            <img src="${img}" alt="Захід">
            <div style="position:absolute; bottom:0; left:0; width:100%; background:rgba(26,42,68,0.7); color:white; padding:10px; font-size:0.75rem;">Альбом ГО</div>
        </div>
    `).join('');
}