import * as render from './render.js';

let currentLang = 'uk';
let cache = {};

// Універсальна функція для завантаження
async function loadData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Помилка: ${url}`);
        return await response.json();
    } catch (e) {
        console.error("Не вдалося завантажити " + url, e);
        return [];
    }
}

async function init() {
    // Завантажуємо все
    cache.founders = await loadData('data/founders.json');
    cache.stats = await loadData('data/stats.json');
    cache.partners = await loadData('data/partners.json');
    cache.news = await loadData('data/news.json');
    cache.stories = await loadData('data/stories.json');
    cache.contacts = await loadData('data/contacts.json');
    cache.activities = await loadData('data/activities.json');

    updateUI();
}

function updateUI() {
    if (cache.activities.length) render.renderActivities(cache.activities, currentLang);
    if (cache.founders.length) render.renderFounders(cache.founders, currentLang);
    if (cache.stats.length) render.renderStats(cache.stats, currentLang);
    if (cache.partners.length) render.renderPartners(cache.partners);
    if (cache.news.length) render.renderNews(cache.news, currentLang);
    if (cache.stories.length) render.renderStories(cache.stories, currentLang);

    // Контакти
    if (cache.contacts && cache.contacts.address) {
        document.getElementById('contacts-content').innerHTML = `
            <p><i class="fas fa-phone"></i> ${cache.contacts.phone}</p>
            <p><i class="fas fa-envelope"></i> ${cache.contacts.email}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${cache.contacts.address[currentLang]}</p>
        `;
    }

    // Переклад статичних елементів
    document.querySelectorAll('[data-' + currentLang + ']').forEach(el => {
        el.innerHTML = el.getAttribute('data-' + currentLang);
    });

    startStatsAnimation();
}

function startStatsAnimation() {
    const counters = document.querySelectorAll('.counter');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                let count = 0;
                const update = () => {
                    const inc = target / 50;
                    if (count < target) {
                        count += inc;
                        entry.target.innerText = Math.ceil(count);
                        setTimeout(update, 30);
                    } else entry.target.innerText = target;
                };
                update();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
}

// Події кнопок мови
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.onclick = (e) => {
        currentLang = e.target.dataset.lang;
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        updateUI();
    };
});

window.openBio = (id) => {
    const f = cache.founders.find(x => x.id === id);
    if (!f) return;
    document.getElementById('modal-data').innerHTML = `
        <div class="bio-flex">
            <img src="${f.img}" class="bio-img">
            <div>
                <h2>${f.name[currentLang]}</h2>
                <p class="bio-role">${f.role[currentLang]}</p>
                <div class="bio-text">${f.bio[currentLang]}</div>
                <p><b>TG:</b> ${f.tg} | <b>Тел:</b> ${f.phone}</p>
            </div>
        </div>`;
    document.getElementById('bioModal').style.display = 'block';
};

document.querySelector('.close-modal').onclick = () => {
    document.getElementById('bioModal').style.display = 'none';
};

document.addEventListener('DOMContentLoaded', init);