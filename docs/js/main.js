import { loadTranslations, translatePage } from './i18n.js';
import * as render from './render.js';

let currentLang = 'uk';
let cache = { translations: {}, activities: [], stats: [], partners: [], team: [], stories: [], news: [], albums: [], founders: [] };

async function init() {
    try {
        const load = async (url) => {
            try { const r = await fetch(url); return r.ok ? await r.json() : []; } catch { return []; }
        };

        const data = await Promise.allSettled([
            loadTranslations(), load('data/activities.json'), load('data/stats.json'),
            load('data/partners.json'), load('data/team.json'), load('data/stories.json'),
            load('data/news.json'), load('data/albums.json'), load('data/founders.json')
        ]);

        cache = {
            translations: data[0].value || {},
            activities: data[1].value || [],
            stats: data[2].value || [],
            partners: data[3].value || [],
            team: data[4].value || [],
            stories: data[5].value || [],
            news: data[6].value || [],
            albums: data[7].value || [],
            founders: data[8].value || []
        };

        setupGlobalEvents();
        updateUI();
    } catch (e) { console.error("System Failure:", e); }
}

function updateUI() {
    try { translatePage(cache.translations, currentLang); } catch(e){}
    try { render.renderActivities(cache.activities, currentLang); } catch(e){}
    try { render.renderStats(cache.stats, currentLang); } catch(e){}
    try { render.renderPartners(cache.partners); } catch(e){}
    try { render.renderTeam(cache.team, currentLang); } catch(e){}
    try { render.renderStories(cache.stories, currentLang); } catch(e){}
    try { render.renderNews(cache.news, currentLang); } catch(e){}
    try { render.renderAlbums(cache.albums, currentLang); } catch(e){}
    try { render.renderFounders(cache.founders, currentLang); } catch(e){}
    
    initIndependentModules();
}

function initIndependentModules() {
    try { initCounters(); } catch(e){}
    try { setTimeout(initPartnersSwiper, 500); } catch(e){}
    try { setupScrollUI(); } catch(e){}
}

// UI LOGIC
function setupScrollUI() {
    const btn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) btn.classList.add('visible');
        else btn.classList.remove('visible');
    });
}

window.scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
window.scrollToFooter = () => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });

// PARTNERS SWIPER
function initPartnersSwiper() {
    if (window.partnersSwiper) window.partnersSwiper.destroy(true, true);
    const container = document.querySelector('.b4-swiper-main');
    if (!container) return;
    window.partnersSwiper = new Swiper('.b4-swiper-main', {
        loop: true, centeredSlides: true, speed: 1000, grabCursor: true,
        autoplay: { delay: 3000, disableOnInteraction: false },
        navigation: { nextEl: '.b4-next', prevEl: '.b4-prev' },
        breakpoints: { 320: { slidesPerView: 1, spaceBetween: 20 }, 768: { slidesPerView: 2.5, spaceBetween: 40 }, 1200: { slidesPerView: 3.5, spaceBetween: 60 } },
        loopedSlides: 12, observer: true, observeParents: true
    });
}

// COUNTERS
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

// GLOBAL EVENTS
function setupGlobalEvents() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentLang = e.target.dataset.lang;
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b === e.target));
            updateUI();
        });
    });

    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('navMenu');
    if (toggle && menu) toggle.onclick = () => menu.classList.toggle('active');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('section').forEach(s => observer.observe(s));
    
    // Форма футера
    const form = document.getElementById('footerForm');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            alert("Повідомлення надіслано успішно!");
            form.reset();
        };
    }
}

// PORTAL & GALLERY
window.toggleAllAlbums = () => {
    const portal = document.getElementById('archivePortal');
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
    new Swiper('.b7-gallery-swiper-engine', { navigation: { nextEl: '.b7-swiper-nav.next', prevEl: '.b7-swiper-nav.prev' }, loop: true });
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