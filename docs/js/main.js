import { loadTranslations, translatePage } from './i18n.js';
import * as render from './render.js';

let currentLang = 'uk';
let cache = { translations: {}, activities: [], stats: [], partners: [], team: [], stories: [], news: [], albums: [], founders: [] };

// ГОЛОВНИЙ ЗАПУСК - ПОВНА ІЗОЛЯЦІЯ КОЖНОГО КРОКУ
async function init() {
    // 1. Спроба завантажити дані (кожен файл вантажиться незалежно)
    const load = async (url) => {
        try {
            const r = await fetch(url);
            return r.ok ? await r.json() : [];
        } catch (e) {
            console.error(`Data load error: ${url}`, e);
            return [];
        }
    };

    const dataResults = await Promise.allSettled([
        loadTranslations(), load('data/activities.json'), load('data/stats.json'),
        load('data/partners.json'), load('data/team.json'), load('data/stories.json'),
        load('data/news.json'), load('data/albums.json'), load('data/founders.json')
    ]);

    cache = {
        translations: dataResults[0].value || {},
        activities: dataResults[1].value || [],
        stats: dataResults[2].value || [],
        partners: dataResults[3].value || [],
        team: dataResults[4].value || [],
        stories: dataResults[5].value || [],
        news: dataResults[6].value || [],
        albums: dataResults[7].value || [],
        founders: dataResults[8].value || []
    };

    // 2. Ізольований запуск системних модулів
    const runModule = (name, fn) => {
        try { fn(); } catch (e) { console.error(`Module Failed: ${name}`, e); }
    };

    runModule("Global Events", setupGlobalEvents);
    runModule("UI Update", updateUI);
}

function updateUI() {
    // Рендер кожного блоку - ПОВНА ІЗОЛЯЦІЯ
    const safeRender = (name, fn) => {
        try { fn(); } catch (e) { console.error(`Render Failed: ${name}`, e); }
    };

    safeRender("Translations", () => translatePage(cache.translations, currentLang));
    safeRender("Block 2 (Activities)", () => render.renderActivities(cache.activities, currentLang));
    safeRender("Block 3 (Stats)", () => render.renderStats(cache.stats, currentLang));
    safeRender("Block 4 (Partners)", () => render.renderPartners(cache.partners));
    safeRender("Block 5 (Team)", () => render.renderTeam(cache.team, currentLang));
    safeRender("Block 6 (Stories)", () => render.renderStories(cache.stories, currentLang));
    safeRender("Block 7 (News)", () => render.renderNews(cache.news, currentLang));
    safeRender("Block 7 (Albums)", () => render.renderAlbums(cache.albums, currentLang));
    safeRender("Block 8 (Founders)", () => render.renderFounders(cache.founders, currentLang));

    // Ініціалізація динаміки
    safeRender("Counters", initCounters);
    safeRender("Scroll UI", setupScrollUI);
    safeRender("Vertical Albums", () => setTimeout(initVerticalAlbums, 600));
}

// BLOCK 3: COUNTERS (ІЗОЛЬОВАНО)
function initCounters() {
    const statItems = document.querySelectorAll('.b3-stat-item');
    statItems.forEach(item => {
        const numEl = item.querySelector('.b3-number');
        if (!numEl) return;
        const target = +numEl.dataset.target;
        const animate = () => {
            let current = 0;
            const timer = setInterval(() => {
                current += target / 50;
                if (current >= target) { numEl.innerText = target; clearInterval(timer); }
                else { numEl.innerText = Math.ceil(current); }
            }, 30);
        };
        new IntersectionObserver((entries, obs) => {
            entries.forEach(en => { if (en.isIntersecting) { animate(); obs.unobserve(en.target); } });
        }, { threshold: 0.5 }).observe(item);
        item.addEventListener('mouseenter', animate);
    });
}

// BLOCK 7: VERTICAL ALBUMS (ІЗОЛЬОВАНО)
function initVerticalAlbums() {
    const isMobile = window.innerWidth < 992;
    new Swiper('.b7-albums-swiper', { 
        direction: isMobile ? 'horizontal' : 'vertical', 
        slidesPerView: isMobile ? 1.2 : 2, 
        spaceBetween: 20, 
        mousewheel: !isMobile, 
        grabCursor: true, 
        nested: true, 
        autoplay: { delay: 3000 } 
    });
}

// UI & NAVIGATION (ІЗОЛЬОВАНО)
function setupScrollUI() {
    const btn = document.getElementById('scrollTopBtn');
    if (btn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) btn.classList.add('visible');
            else btn.classList.remove('visible');
        });
    }
}

window.scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
window.scrollToFooter = () => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });

function setupGlobalEvents() {
    // Мови
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentLang = e.target.dataset.lang;
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b === e.target));
            updateUI();
        });
    });

    // Меню
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('navMenu');
    if (toggle && menu) toggle.onclick = () => menu.classList.toggle('active');

    // Скрол-анімація
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('section').forEach(s => observer.observe(s));
    
    // Форма
    const form = document.getElementById('footerForm');
    if (form) form.onsubmit = (e) => { e.preventDefault(); alert("Дякуємо! Запит отримано."); form.reset(); };
}

// ПУБЛІЧНІ ФУНКЦІЇ ВЗАЄМОДІЇ
window.toggleAllAlbums = () => {
    const portal = document.getElementById('archivePortal');
    if (!portal) return;
    portal.style.display = portal.style.display === 'block' ? 'none' : 'block';
    document.body.style.overflow = portal.style.display === 'block' ? 'hidden' : 'auto';
};

window.openGallery = (id) => {
    const album = cache.albums.find(a => a.id === id);
    if (!album) return;
    const wrapper = document.getElementById('modal-gallery-wrapper');
    wrapper.innerHTML = album.photos.map(src => `<div class="swiper-slide"><img src="${src}"></div>`).join('');
    document.getElementById('galleryModal').style.display = 'flex';
    if (window.gallerySwiper) window.gallerySwiper.destroy();
    window.gallerySwiper = new Swiper('.b7-gallery-swiper-engine', { navigation: { nextEl: '.next', prevEl: '.prev' }, loop: true });
};

window.openFounderBio = (id) => {
    const f = cache.founders.find(x => x.id === id);
    if (!f) return;
    document.getElementById('f-modal-img').src = f.img;
    document.getElementById('f-modal-name').innerText = f.name;
    document.getElementById('f-modal-role').innerText = f.role[currentLang];
    document.getElementById('f-modal-desc').innerText = f.bio[currentLang];
    document.getElementById('foundersModal').style.display = 'flex';
};

document.addEventListener('DOMContentLoaded', init);