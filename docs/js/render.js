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
            <p style="margin-top:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px;">${item.label[lang]}</p>
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
            <p style="color:var(--accent); font-weight:700; font-size:0.9rem;">${f.role[lang]}</p>
        </div>
    `).join('');
}

export function renderFriends(data, lang) {
    const container = document.getElementById('friends-container');
    if (!container || !data) return;
    container.innerHTML = data.map(f => `
        <div class="friend-card">
            <img src="${f.img}" alt="${f.name}">
            <h4 style="color:var(--primary);">${f.name}</h4>
            <p style="color:var(--accent); font-size:0.85rem; font-weight:600;">${f.role[lang]}</p>
        </div>
    `).join('');
}

export function renderNews(data, lang) {
    const container = document.getElementById('news-container');
    if (!container || !data) return;
    container.innerHTML = data.map(n => `
        <div class="news-card">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:0.8rem; font-weight:700;">
                <span style="background:var(--primary); color:white; padding:3px 12px; border-radius:50px;">${n.tag[lang]}</span>
                <span style="color:var(--gray);">${n.date}</span>
            </div>
            <h4 style="color:var(--primary);">${n.title[lang]}</h4>
            <p style="font-size:0.85rem; color:#666; margin-top:8px;">${n.desc[lang]}</p>
            <a href="${n.link || '#'}" target="_blank" style="color:var(--accent); font-weight:700; font-size:0.8rem; margin-top:10px; display:inline-block;">Читати більше...</a>
        </div>
    `).join('');
}

export function renderPartners(data) {
    const track = document.getElementById('partners-track');
    if (!track || !data) return;
    const list = data.length > 0 ? data : [{name: "ГО", img: ""}];
    const double = [...list, ...list, ...list];
    track.innerHTML = double.map(p => {
        const imgSrc = p.img || `https://via.placeholder.com/200x80?text=${p.name}`;
        return `<a href="${p.link || '#'}" target="_blank"><img src="${imgSrc}" alt="${p.name}" referrerpolicy="no-referrer"></a>`;
    }).join('');
}

export function renderStories(data, lang) {
    const container = document.getElementById('stories-container');
    if (!container || !data) return;
    container.innerHTML = data.map(s => `
        <div class="story-card"><img src="${s.img}" alt="${s.name[lang]}" style="width:70px;height:70px;border-radius:50%;object-fit:cover;"><div style="text-align:left;"><h4 style="color:var(--primary);">${s.name[lang]}</h4><p style="font-style:italic; margin-top:5px; font-size:0.9rem;">"${s.text[lang]}"</p></div></div>
    `).join('');
}

export function renderGallery(data) {
    const container = document.getElementById('gallery-preview');
    if (!container || !data) return;
    container.innerHTML = data.map(img => `
        <div class="gallery-item" onclick="openFullImage('${img}')"><img src="${img}" alt="Захід"></div>
    `).join('');
}