import { loadTranslations, translatePage } from './i18n.js';
import * as render from './render.js';

let currentLang = 'uk';
let cache = { translations: {}, activities: [], stats: [], partners: [], team: [], stories: [], news: [], albums: [], founders: [] };

// СИСТЕМА ПОВНОЇ ІЗОЛЯЦІЇ (TITAN CORE)
async function init() {
    try {
        const load = async (url) => {
            try {
                const r = await fetch(url);
                if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
                return await r.json();
            } catch (e) {
                console.warn(`Failed to load ${url}:`, e);
                return [];
            }
        };

        // Завантажуємо все незалежно
        const results = await Promise.allSettled([
            loadTranslations(), load('data/activities.json'), load('data/stats.json'),
            load('data/partners.json'), load('data/team.json'), load('data/stories.json'),
            load('data/news.json'), load('data/albums.json'), load('data/founders.json')
        ]);

        // Присвоюємо кеш (використовуємо іменовані результати для надійності)
        cache = {
            translations: results[0].value || {},
            activities: results[1].value || [],
            stats: results[2].value || [],
            partners: results[3].value || [],
            team: results[4].value || [],
            stories: results[5].value || [],
            news: results[6].value || [],
            albums: results[7].value || [],
            founders: results[8].value || []
        };

        setupGlobalEvents();
        updateUI();
    } catch (e) {
        console.error("Critical System Failure:", e);
    }
}

function updateUI() {
    // Рендер з індивідуальним захистом (Try-Catch для кожного блоку)
    const renderBlock = (name, fn) => {
        try { fn(); } catch(e) { console.error(`Render error in ${name}:`, e); }
    };

    renderBlock("Translate", () => translatePage(cache.translations, currentLang));
    renderBlock("Activities", () => render.renderActivities(cache.activities, currentLang));
    renderBlock("Stats", () => render.renderStats(cache.stats, currentLang));
    renderBlock("Partners", () => render.renderPartners(cache.partners));
    renderBlock("Team", () => render.renderTeam(cache.team, currentLang));
    renderBlock("Stories", () => render.renderStories(cache.stories, currentLang));
    renderBlock("News", () => render.renderNews(cache.news, currentLang));
    renderBlock("Albums", () => render.renderAlbums(cache.albums, currentLang));
    renderBlock("Founders", () => render.renderFounders(cache.founders, currentLang));
    
    // Ініціалізація динамічних функцій
    renderBlock("Counters", initCounters);
    renderBlock("ScrollUI", setupScrollUI);
    renderBlock("Swiper", () => setTimeout(initVerticalAlbums, 1000));
}

// BLOCK 8: DOSSIER LOGIC (КЛІК ВСЮДИ ДЛЯ ЗАКРИТТЯ)
window.openFounderBio = (id, event) => {
    if (event) event.stopPropagation(); // Зупиняємо спливання, щоб модалка не закрилася миттєво
    
    const f = cache.founders.find(x => x.id === id);
    if (!f) return;
    
    document.getElementById('f-modal-img').src = f.img;
    document.getElementById('f-modal-name').innerText = f.name;
    document.getElementById('f-modal-role').innerText = f.role[currentLang];
    document.getElementById('f-modal-desc').innerText = f.bio[currentLang];
    
    const modal = document.getElementById('foundersModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Заборона скролу фону

    // Додаємо одноразову подію на весь документ для закриття
    setTimeout(() => {
        const closeHandler = () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            document.removeEventListener('click', closeHandler);
        };
        document.addEventListener('click', closeHandler);
    }, 100);
};

// BLOCK 7: SWIPER
function initVerticalAlbums() {
    const isMobile = window.innerWidth < 992;
    const el = document.querySelector('.b7-albums-swiper');
    if (!el) return;
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

// GLOBAL UI
function setupScrollUI() {
    const btn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) btn?.classList.add('visible');
        else btn?.classList.remove('visible');
    });
}

window.scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
window.scrollToFooter = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

function initCounters() {
    document.querySelectorAll('.b3-stat-item').forEach(item => {
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

function setupGlobalEvents() {
    // Мови
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentLang = e.target.dataset.lang;
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b === e.target));
            updateUI();
        });
    });

    // Мобільне меню
    const toggle = document.getElementById('menuToggle'), menu = document.getElementById('navMenu');
    if (toggle && menu) toggle.onclick = () => menu.classList.toggle('active');

    // Scroll Reveal (Active Class)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('section').forEach(s => observer.observe(s));
    
    // Форма
    const form = document.getElementById('footerForm');
    if (form) form.onsubmit = (e) => { e.preventDefault(); alert("Дякуємо! Запит отримано."); form.reset(); };
}

window.toggleAllAlbums = () => {
    const portal = document.getElementById('archivePortal');
    if (!portal) return;
    const isVisible = portal.style.display === 'block';
    portal.style.display = isVisible ? 'none' : 'block';
    document.body.style.overflow = isVisible ? 'auto' : 'hidden';
};

window.openGallery = (id) => {
    const album = cache.albums.find(a => a.id === id);
    if (!album) return;
    const wrapper = document.getElementById('modal-gallery-wrapper');
    wrapper.innerHTML = album.photos.map(src => `<div class="swiper-slide"><img src="${src}"></div>`).join('');
    document.getElementById('galleryModal').style.display = 'flex';
    new Swiper('.b7-gallery-swiper-engine', { navigation: { nextEl: '.next', prevEl: '.prev' }, loop: true });
};

document.addEventListener('DOMContentLoaded', init);