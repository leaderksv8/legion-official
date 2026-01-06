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

export function renderPartners(data) {
    const track = document.getElementById('partners-track');
    if (!track || !data) return;
    const list = [...data, ...data, ...data];
    track.innerHTML = list.map(p => {
        const imgSrc = p.img || `https://via.placeholder.com/200x80?text=${p.name}`;
        return `<a href="${p.link || '#'}" target="_blank"><img src="${imgSrc}" alt="${p.name}" referrerpolicy="no-referrer"></a>`;
    }).join('');
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

export function renderFriends(data, lang) {
    const container = document.getElementById('friends-container');
    if (!container || !data) return;
    container.innerHTML = data.map(f => `
        <div class="friend-card">
            <img src="${f.img}" alt="${f.name}" style="width:120px;height:120px;border-radius:50%;object-fit:cover;border:3px solid var(--accent);margin-bottom:15px;">
            <h4>${f.name}</h4>
            <p style="color:var(--accent); font-weight:600;">${f.role[lang]}</p>
        </div>
    `).join('');
}

export function renderStories(data, lang) {
    const container = document.getElementById('stories-container');
    if (!container || !data) return;
    container.innerHTML = data.map(s => `
        <div class="story-card" style="background:white; padding:20px; border-radius:15px; margin-bottom:15px; display:flex; align-items:center; gap:15px; box-shadow:var(--shadow);">
            <img src="${s.img}" alt="${s.name[lang]}" style="width:60px;height:60px;border-radius:50%;object-fit:cover;"><div style="text-align:left;"><h4>${s.name[lang]}</h4><p style="font-style:italic; font-size:0.85rem;">"${s.text[lang]}"</p></div></div>
    `).join('');
}