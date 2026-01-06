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
    container.innerHTML = data.map(n => `
        <div class="news-card">
            <div style="display:flex; justify-content:space-between;">
                <span class="news-tag">${n.tag[lang]}</span>
                <span style="color:var(--gray); font-size:0.8rem;">${n.date}</span>
            </div>
            <h4 style="color:var(--primary); margin-top:10px;">${n.title[lang]}</h4>
            <p style="font-size:0.85rem; color:#666; margin-top:8px;">${n.desc[lang]}</p>
        </div>
    `).join('');
}

export function renderPartners(data) {
    const track = document.getElementById('partners-track');
    if (!track || !data) return;
    const list = [...data, ...data, ...data];
    track.innerHTML = list.map(p => {
        const imgSrc = p.img || `https://via.placeholder.com/200x80?text=${p.name}`;
        return `<a href="${p.link || '#'}" target="_blank"><img src="${imgSrc}" alt="${p.name}" referrerpolicy="no-referrer"></a>`;
    }).join('');
}

export function renderStories(data, lang) {
    const container = document.getElementById('stories-container');
    if (!container || !data) return;
    container.innerHTML = data.map(s => `
        <div class="story-card" style="background:white; padding:30px; border-radius:20px; box-shadow:var(--shadow); margin-bottom:20px; display:flex; align-items:center; gap:25px; border-left:8px solid var(--accent);">
            <div style="font-size:2rem; color:var(--accent); opacity:0.3;"><i class="fas fa-quote-left"></i></div>
            <div style="text-align:left;">
                <h4 style="color:var(--primary); font-size:1.2rem;">${s.name[lang]}</h4>
                <p style="font-style:italic; margin-top:5px; color:#555;">"${s.text[lang]}"</p>
            </div>
        </div>
    `).join('');
}

export function renderGallery(data) {
    const container = document.getElementById('gallery-preview');
    if (!container || !data) return;
    container.innerHTML = `<div class="gallery-grid">
        ${data.map(img => `<div class="gallery-item" onclick="openFullImage('${img}')"><img src="${img}" alt="Захід"></div>`).join('')}
    </div>`;
}

export function renderFriends(data, lang) {
    const container = document.getElementById('friends-container');
    if (!container || !data) return;
    container.innerHTML = data.map(f => `
        <div class="friend-card" style="background:white; padding:25px; border-radius:20px; box-shadow:var(--shadow); text-align:center;">
            <img src="${f.img}" alt="${f.name}" style="width:120px;height:120px;border-radius:50%;object-fit:cover;border:3px solid var(--accent);margin-bottom:15px;">
            <h4>${f.name}</h4>
            <p style="color:var(--accent); font-weight:600;">${f.role[lang]}</p>
        </div>
    `).join('');
}