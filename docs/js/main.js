import { loadTranslations, translatePage } from './i18n.js';
import * as render from './render.js';

let currentLang = 'uk';
let cache = { translations: {}, activities: [], stats: [], partners: [], team: [], stories: [], news: [], albums: [], founders: [] };

async function init() {
    try {
        const load = async (url) => { try { const r = await fetch(url); return r.ok ? await r.json() : []; } catch (e) { return []; } };
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
        setupGlobalEvents();
        updateUI();
    } catch (e) { console.error("Global Init Error:", e); }
}

function updateUI() {
    const safeExec = (name, fn) => { try { fn(); } catch(e) { console.error(`Error in ${name}:`, e); } };
    safeExec("Translate", () => translatePage(cache.translations, currentLang));
    safeExec("Activities", () => render.renderActivities(cache.activities, currentLang));
    safeExec("Stats", () => render.renderStats(cache.stats, currentLang));
    safeExec("Partners", () => render.renderPartners(cache.partners));
    safeExec("Team", () => render.renderTeam(cache.team, currentLang));
    safeExec("Stories", () => render.renderStories(cache.stories, currentLang));
    safeExec("News", () => render.renderNews(cache.news, currentLang));
    safeExec("Albums", () => render.renderAlbums(cache.albums, currentLang));
    safeExec("Founders", () => render.renderFounders(cache.founders, currentLang));
    try { initCounters(); } catch(e){}
    try { setupScrollUI(); } catch(e){}
}

window.closeAllModals = () => {
    ['galleryModal', 'foundersModal', 'archivePortal'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
};

window.openFounderBio = (id, event) => {
    if (event) event.stopPropagation();
    const f = cache.founders.find(x => x.id === id);
    if (!f) return;
    document.getElementById('f-modal-name').innerText = f.name;
    document.getElementById('f-modal-role').innerText = f.role[currentLang];
    document.getElementById('f-modal-desc').innerText = f.bio[currentLang];
    document.getElementById('foundersModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => { window.addEventListener('click', window.closeAllModals, { once: true }); }, 10);
};

window.toggleAllAlbums = (e) => {
    e?.stopPropagation();
    const portal = document.getElementById('archivePortal');
    portal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    setTimeout(() => { window.addEventListener('click', window.closeAllModals, { once: true }); }, 10);
};

window.openGallery = (id) => {
    const album = cache.albums.find(a => a.id === id);
    if (!album) return;
    const wrapper = document.getElementById('modal-gallery-wrapper');
    wrapper.innerHTML = album.photos.map(src => `<div class="swiper-slide"><img src="${src}"></div>`).join('');
    document.getElementById('galleryModal').style.display = 'flex';
    new Swiper('.b7-gallery-swiper-engine', { navigation: { nextEl: '.next', prevEl: '.prev' }, loop: true });
    setTimeout(() => { window.addEventListener('click', window.closeAllModals, { once: true }); }, 10);
};

function setupScrollUI() {
    const btn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => { if (window.scrollY > 500) btn?.classList.add('visible'); else btn?.classList.remove('visible'); });
}

window.scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
window.scrollToFooter = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

function initCounters() {
    document.querySelectorAll('.b3-stat-item').forEach(item => {
        const numEl = item.querySelector('.b3-number');
        if (!numEl) return;
        const target = +numEl.dataset.target;
        const animate = () => { let c = 0; const t = setInterval(() => { c += target / 50; if (c >= target) { numEl.innerText = target; clearInterval(t); } else { numEl.innerText = Math.ceil(c); } }, 30); };
        new IntersectionObserver((entries, obs) => { entries.forEach(en => { if (en.isIntersecting) { animate(); obs.unobserve(en.target); } }); }, { threshold: 0.5 }).observe(item);
        item.addEventListener('mouseenter', animate);
    });
}

function setupGlobalEvents() {
    document.querySelectorAll('.lang-btn').forEach(btn => { btn.onclick = () => { currentLang = btn.dataset.lang; document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b === btn)); updateUI(); }; });
    const toggle = document.getElementById('menuToggle'), menu = document.getElementById('navMenu');
    if (toggle && menu) toggle.onclick = () => menu.classList.toggle('active');
    const scrollObserver = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); }); }, { threshold: 0.1 });
    document.querySelectorAll('section').forEach(s => scrollObserver.observe(s));
}

document.addEventListener('DOMContentLoaded', init);