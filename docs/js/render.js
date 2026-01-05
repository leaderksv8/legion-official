export function renderActivities(data, lang) {
    const container = document.getElementById('activities-cards');
    if (!container || !data) return;
    container.innerHTML = data.map(item => `
        <div class="activity-card">
            <div class="card-icon"><i class="fas fa-${item.icon}"></i></div>
            <h3 style="color:var(--primary); font-size:1.2rem;">${item.title[lang]}</h3>
            <p style="margin-top:10px; font-size:0.9rem;">${item.desc[lang]}</p>
        </div>
    `).join('');
}

export function renderStats(data, lang) {
    const container = document.getElementById('stats-container');
    if (!container || !data) return;
    container.innerHTML = data.map(item => `
        <div class="stat-item">
            <h2 class="counter" data-target="${item.value}">0</h2>
            <p style="margin-top:10px; font-weight:700; text-transform:uppercase;">${item.label[lang]}</p>
        </div>
    `).join('');
}

export function renderFounders(data, lang) {
    const container = document.getElementById('founders-container');
    if (!container || !data) return;
    container.innerHTML = data.map(f => `
        <div class="founder-card" onclick="openBio('${f.id}')">
            <div class="founder-img-wrapper"><img src="${f.img}" alt="${f.name[lang]}"></div>
            <h4 style="margin-top:20px; color:var(--primary);">${f.name[lang]}</h4>
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
                <span class="news-tag">${n.tag[lang]}</span>
                <span style="color:var(--gray); font-size:0.8rem;">${n.date}</span>
            </div>
            <h4 style="color:var(--primary); margin-top:10px;">${n.title[lang]}</h4>
            <p style="font-size:0.85rem; color:#666; margin-top:10px;">${n.desc[lang]}</p>
        </div>
    `).join('');
}

export function renderGallery(data) {
    const container = document.getElementById('gallery-preview');
    if (!container || !data) return;
    const list = [...data, ...data];
    container.innerHTML = list.map(img => `
        <div class="gallery-item album-card" onclick="openFullImage('${img}')">
            <img src="${img}" alt="Захід">
        </div>
    `).join('');
}

export function renderPartners(data) {
    const track = document.getElementById('partners-track');
    if (!track || !data) return;
    const list = [...data, ...data, ...list];
    track.innerHTML = list.map(p => {
        const imgSrc = p.img || `https://via.placeholder.com/200x80?text=${p.name}`;
        return `<a href="${p.link || '#'}" target="_blank"><img src="${imgSrc}" alt="${p.name}" referrerpolicy="no-referrer"></a>`;
    }).join('');
}

export function renderFriends(data, lang) {
    const container = document.getElementById('friends-container');
    if (!container || !data) return;
    container.innerHTML = data.map(f => `
        <div class="friend-card">
            <img src="${f.img}" alt="${f.name}">
            <h4>${f.name}</h4>
            <p style="color:var(--accent); font-weight:600;">${f.role[lang]}</p>
        </div>
    `).join('');
}

export function renderStories(data, lang) {
    const container = document.getElementById('stories-container');
    if (!container || !data) return;
    container.innerHTML = data.map(s => `
        <div class="story-card">
            <i class="fas fa-quote-left" style="font-size:3rem; opacity:0.1; position:absolute; left:20px; top:20px;"></i>
            <img src="${s.img}" alt="${s.name[lang]}" style="width:100px;height:100px;border-radius:50%;object-fit:cover; border:4px solid var(--accent); position:relative;">
            <div style="text-align:left; position:relative;">
                <h4 style="color:var(--primary); font-size:1.3rem;">${s.name[lang]}</h4>
                <p style="font-style:italic; margin-top:10px; font-size:1rem; color:#444;">"${s.text[lang]}"</p>
            </div>
        </div>
    `).join('');
}