import { loadTranslations, translatePage } from './i18n.js';
import * as render from './render.js';

let currentLang = 'uk';
let cache = { translations: {}, activities: [], stats: [], partners: [], team: [], stories: [], news: [], albums: [], founders: [] };

// СИСТЕМА УПРАВЛІННЯ МОДАЛКАМИ
const UIController = {
    closeAll() {
        ['galleryModal', 'foundersModal', 'archivePortal'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    },
    setupGlobalClick() {
        document.addEventListener('click', (e) => {
            const modals = ['.b7-gallery-modal', '.b8-dossier-overlay', '.b7-portal-overlay'];
            modals.forEach(selector => {
                const el = document.querySelector(selector);
                if (el && el.style.display === 'flex' || el?.style.display === 'block') {
                    // Якщо клік був саме по оверлею (фону), закриваємо
                    if (e.target === el) this.closeAll();
                }
            });
        });
    }
};

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
            translations: data[0].value || {}, activities: data[1].value || [], stats: data[2].value || [],
            partners: data[3].value || [], team: data[4].value || [], stories: data[5].value || [],
            news: data[6].value || [], albums: data[7].value || [], founders: data[8].value || []
        };

        UIController.setupGlobalClick();
        setupGlobalEvents();
        updateUI();
    } catch (e) { console.error("Global System Error:", e); }
}

function updateUI() {
    const safeExec = (fn) => { try { fn(); } catch(e) {} };

    safeExec(() => translatePage(cache.translations, currentLang));
    safeExec(() => render.renderActivities(cache.activities, currentLang));
    safeExec(() => render.renderStats(cache.stats, currentLang));
    safeExec(() => render.renderPartners(cache.partners));
    safeExec(() => render.renderTeam(cache.team, currentLang));
    safeExec(() => render.renderStories(cache.stories, currentLang));
    safeExec(() => render.renderNews(cache.news, currentLang));
    safeExec(() => render.renderAlbums(cache.albums, currentLang));
    safeExec(() => render.renderFounders(cache.founders, currentLang));
    
    safeExec(() => initCounters());
    safeExec(() => setupScrollUI());
}

function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numEl = entry.target.querySelector('.b3-number');
                if (numEl) animateNumber(numEl);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.b3-stat-item').forEach(item => {
        observer.observe(item);
        item.onmouseenter = () => animateNumber(item.querySelector('.b3-number'));
    });
}

function animateNumber(el) {
    if (!el) return;
    const target = +el.dataset.target;
    let current = 0;
    const step = target / 50;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) { el.innerText = target; clearInterval(timer); }
        else { el.innerText = Math.ceil(current); }
    }, 30);
}

function setupScrollUI() {
    const btn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => {
        btn?.classList.toggle('visible', window.scrollY > 600);
    });
}

// ПУБЛІЧНІ МЕТОДИ
window.scrollToTop = (e) => { e?.stopPropagation(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
window.scrollToFooter = (e) => { e?.stopPropagation(); document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }); };
window.closeAllModals = () => UIController.closeAll();

window.toggleAllAlbums = (e) => {
    e?.stopPropagation();
    const portal = document.getElementById('archivePortal');
    const isVisible = portal.style.display === 'block';
    portal.style.display = isVisible ? 'none' : 'block';
    document.body.style.overflow = isVisible ? 'auto' : 'hidden';
};

window.openGallery = (id) => {
    const album = cache.albums.find(a => a.id === id);
    if (!album) return;
    const wrapper = document.getElementById('modal-gallery-wrapper');
    wrapper.innerHTML = album.photos.map(src => `<div class="swiper-slide"><img src="${src}" loading="lazy"></div>`).join('');
    document.getElementById('galleryModal').style.display = 'flex';
    if (window.gallerySwiper) window.gallerySwiper.destroy();
    window.gallerySwiper = new Swiper('.b7-gallery-swiper-engine', {
        navigation: { nextEl: '.next', prevEl: '.prev' }, loop: true
    });
};

window.openFounderBio = (id, event) => {
    event?.stopPropagation();
    const f = cache.founders.find(x => x.id === id);
    if (!f) return;
    document.getElementById('f-modal-img').src = f.img;
    document.getElementById('f-modal-name').innerText = f.name;
    document.getElementById('f-modal-role').innerText = f.role[currentLang];
    document.getElementById('f-modal-desc').innerText = f.bio[currentLang];
    document.getElementById('foundersModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
};

function setupGlobalEvents() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.onclick = () => {
            currentLang = btn.dataset.lang;
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b === btn));
            updateUI();
        };
    });

    const toggle = document.getElementById('menuToggle'), menu = document.getElementById('navMenu');
    if (toggle && menu) toggle.onclick = () => menu.classList.toggle('active');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('section').forEach(s => scrollObserver.observe(s));
}

document.addEventListener('DOMContentLoaded', init);