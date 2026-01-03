import * as render from './render.js';

let currentLang = 'uk';
let cache = {
    founders: [],
    stats: [],
    partners: [],
    news: [],
    stories: [],
    contacts: {},
    activities: []
};

async function loadData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Не знайдено: ${url}`);
        return await response.json();
    } catch (e) {
        console.error("Помилка завантаження файлу: " + url, e);
        return null; // Повертаємо null, щоб програма знала про помилку
    }
}

async function init() {
    console.log("Завантаження даних...");
    
    // Завантажуємо всі файли
    const founders = await loadData('data/founders.json');
    const stats = await loadData('data/stats.json');
    const partners = await loadData('data/partners.json');
    const news = await loadData('data/news.json');
    const stories = await loadData('data/stories.json');
    const contacts = await loadData('data/contacts.json');
    const activities = await loadData('data/activities.json');

    // Наповнюємо кеш тільки якщо дані успішно отримані
    if (founders) cache.founders = founders;
    if (stats) cache.stats = stats;
    if (partners) cache.partners = partners;
    if (news) cache.news = news;
    if (stories) cache.stories = stories;
    if (contacts) cache.contacts = contacts;
    if (activities) cache.activities = activities;

    updateUI();
}

function updateUI() {
    console.log("Оновлення інтерфейсу...");
    
    // Рендеримо блоки тільки якщо в них є дані
    if (cache.activities && cache.activities.length > 0) render.renderActivities(cache.activities, currentLang);
    if (cache.founders && cache.founders.length > 0) render.renderFounders(cache.founders, currentLang);
    if (cache.stats && cache.stats.length > 0) render.renderStats(cache.stats, currentLang);
    if (cache.partners && cache.partners.length > 0) render.renderPartners(cache.partners);
    if (cache.news && cache.news.length > 0) render.renderNews(cache.news, currentLang);
    if (cache.stories && cache.stories.length > 0) render.renderStories(cache.stories, currentLang);

    // Контакти
    if (cache.contacts && cache.contacts.phone) {
        const contactBlock = document.getElementById('contacts-content');
        if (contactBlock) {
            contactBlock.innerHTML = `
                <p><i class="fas fa-phone"></i> ${cache.contacts.phone}</p>
                <p><i class="fas fa-envelope"></i> ${cache.contacts.email}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${cache.contacts.address[currentLang]}</p>
            `;
        }
    }

    // Статичні тексти
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

// Події зміни мови
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentLang = e.currentTarget.dataset.lang;
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        updateUI();
    });
});

// Модальне вікно
window.openBio = (id) => {
    const f = cache.founders.find(x => x.id === id);
    if (!f) return;
    
    const modal = document.getElementById('bioModal');
    const modalData = document.getElementById('modal-data');
    if (modal && modalData) {
        modalData.innerHTML = `
            <div class="bio-flex">
                <img src="${f.img}" class="bio-img">
                <div>
                    <h2>${f.name[currentLang]}</h2>
                    <p class="bio-role" style="color:var(--accent); font-weight:700; margin-bottom:20px;">${f.role[currentLang]}</p>
                    <div class="bio-text">${f.bio[currentLang]}</div>
                    <p style="margin-top:20px;"><b>TG:</b> ${f.tg} | <b>Тел:</b> ${f.phone}</p>
                </div>
            </div>`;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
};

const closeModal = () => {
    const modal = document.getElementById('bioModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

// Прив'язка закриття
const closeBtn = document.querySelector('.close-modal');
if (closeBtn) closeBtn.onclick = closeModal;

window.onclick = (event) => {
    const modal = document.getElementById('bioModal');
    if (event.target === modal) closeModal();
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

document.addEventListener('DOMContentLoaded', init);