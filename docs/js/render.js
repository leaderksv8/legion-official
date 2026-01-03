// Блок 2: Діяльність
export function renderActivities(data, lang) {
    const container = document.getElementById('activities-cards');
    container.innerHTML = data.map(item => `
        <div class="activity-card">
            <div class="card-icon"><i class="fas fa-${item.icon}"></i></div>
            <h3>${item.title[lang]}</h3>
            <p>${item.desc[lang]}</p>
        </div>
    `).join('');
}

// Блок 3: Звітність
export function renderStats(data, lang) {
    const container = document.getElementById('stats-container');
    container.innerHTML = data.map(item => `
        <div class="stat-item">
            <h2 class="counter" data-target="${item.value}">0</h2>
            <p>${item.label[lang]}</p>
        </div>
    `).join('');
}

// Блок 4: Партнери
export function renderPartners(data) {
    const track = document.getElementById('partners-track');
    const double = [...data, ...data];
    track.innerHTML = double.map(p => `
        <a href="${p.link}" target="_blank"><img src="${p.img}" alt="${p.name}"></a>
    `).join('');
}

// Блок 5: Історії
export function renderStories(data, lang) {
    const container = document.getElementById('stories-container');
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

// Блок 6: Новини (Острів)
export function renderNews(data, lang) {
    const container = document.getElementById('news-container');
    container.innerHTML = data.map(n => `
        <div class="news-island">
            <div class="news-meta">
                <span class="news-tag">${n.tag[lang]}</span>
                <span class="news-date">${n.date}</span>
            </div>
            <h4>${n.title[lang]}</h4>
        </div>
    `).join('');
}

// Блок 6: Галерея
export function renderGallery(data) {
    const container = document.getElementById('gallery-preview');
    container.innerHTML = data.map(img => `
        <div class="gallery-item">
            <img src="${img}" alt="Захід">
        </div>
    `).join('');
}

// Блок 7: Засновники
export function renderFounders(data, lang) {
    const container = document.getElementById('founders-container');
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