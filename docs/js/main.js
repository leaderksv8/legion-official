import * as render from './render.js';

let currentLang = 'uk';
let cache = {};

async function loadFile(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        return null;
    }
}

async function init() {
    // Завантажуємо 7 основних файлів
    cache.founders = await loadFile('data/founders.json');
    cache.stats = await loadFile('data/stats.json');
    cache.partners = await loadData('data/partners.json');
    cache.news = await loadFile('data/news.json');
    cache.stories = await loadFile('data/stories.json');
    cache.contacts = await loadFile('data/contacts.json');
    cache.activities = await loadFile('data/activities.json');

    updatePage();
}

// Окремо винесена функція для партнерів (виправляємо помилку fetch)
async function loadData(url) {
    const res = await fetch(url);
    return res.ok ? await res.json() : null;
}

function updatePage() {
    if (cache.activities) render.renderActivities(cache.activities, currentLang);
    if (cache.founders) render.renderFounders(cache.founders, currentLang);
    if (cache.stats) render.renderStats(cache.stats, currentLang);
    if (cache.partners) render.renderPartners(cache.partners);
    if (cache.news) render.renderNews(cache.news, currentLang);
    if (cache.stories) render.renderStories(cache.stories, currentLang);

    if (cache.contacts) {
        const cBlock = document.getElementById('contacts-content');
        if (cBlock) {
            cBlock.innerHTML = `
                <p><i class="fas fa-phone"></i> ${cache.contacts.phone}</p>
                <p><i class="fas fa-envelope"></i> ${cache.contacts.email}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${cache.contacts.address[currentLang]}</p>
            `;
        }
    }

    document.querySelectorAll('[data-' + currentLang + ']').forEach(el => {
        el.innerHTML = el.getAttribute('data-' + currentLang);
    });

    animateNumbers();
}

function animateNumbers() {
    const counters = document.querySelectorAll('.counter');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.dataset.target;
                let count = 0;
                const step = () => {
                    const inc = target / 50;
                    if (count < target) {
                        count += inc;
                        entry.target.innerText = Math.ceil(count);
                        setTimeout(step, 30);
                    } else entry.target.innerText = target;
                };
                step();
                obs.unobserve(entry.target);
            }
        });
    });
    counters.forEach(c => obs.observe(c));
}

// Модалка
window.openBio = (id) => {
    const f = cache.founders.find(x => x.id === id);
    if (!f) return;
    const modal = document.getElementById('bioModal');
    document.getElementById('modal-data').innerHTML = `
        <div class="bio-flex">
            <img src="${f.img}" class="bio-img">
            <div>
                <h2>${f.name[currentLang]}</h2>
                <p style="color:var(--accent);font-weight:700;">${f.role[currentLang]}</p>
                <div style="margin-top:15px;">${f.bio[currentLang]}</div>
            </div>
        </div>`;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
};

window.onclick = (e) => {
    const m = document.getElementById('bioModal');
    if (e.target === m) {
        m.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

document.querySelectorAll('.lang-btn').forEach(b => {
    b.onclick = (e) => {
        currentLang = e.target.dataset.lang;
        document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        updatePage();
    };
});

document.addEventListener('DOMContentLoaded', init);