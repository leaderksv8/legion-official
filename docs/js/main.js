import { loadTranslations, translatePage } from './i18n.js';
import * as render from './render.js';

let currentLang = 'uk';
let cache = { translations: {}, activities: [], stats: [], partners: [], team: [], stories: [], news: [], albums: [], founders: [] };

async function init() {
    try {
        const load = async (url) => { const r = await fetch(url); return r.ok ? await r.json() : []; };
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
    } catch (e) { console.error("Global System Failure", e); }
}

function updateUI() {
    const safe = (fn) => { try { fn(); } catch(e) {} };
    safe(() => translatePage(cache.translations, currentLang));
    safe(() => render.renderActivities(cache.activities, currentLang));
    safe(() => render.renderStats(cache.stats, currentLang));
    safe(() => render.renderPartners(cache.partners));
    safe(() => render.renderTeam(cache.team, currentLang));
    safe(() => render.renderStories(cache.stories, currentLang));
    safe(() => render.renderNews(cache.news, currentLang));
    safe(() => render.renderAlbums(cache.albums, currentLang));
    safe(() => render.renderFounders(cache.founders, currentLang));
    initCounters();
    setupScrollUI();
}

window.openSupportModal = () => document.getElementById('supportModal').style.display = 'flex';
window.toggleAllAlbums = () => document.getElementById('archivePortal').style.display = 'flex';

window.openFounderBio = (id, e) => {
    e.stopPropagation();
    const f = cache.founders.find(x => x.id === id);
    if (!f) return;
    document.getElementById('f-modal-name').innerText = f.name;
    document.getElementById('f-modal-role').innerText = f.role[currentLang];
    document.getElementById('f-modal-desc').innerText = f.bio[currentLang];
    document.getElementById('foundersModal').style.display = 'flex';
};

window.openGallery = (id) => {
    const album = cache.albums.find(a => a.id === id);
    if (!album) return;
    document.getElementById('modal-gallery-wrapper').innerHTML = album.photos.map(src => `<div class="swiper-slide"><img src="${src}"></div>`).join('');
    document.getElementById('galleryModal').style.display = 'flex';
    new Swiper('.gallery-swiper', { navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }, loop: true });
};

window.closeAllModals = () => {
    ['supportModal', 'archivePortal', 'foundersModal', 'galleryModal'].forEach(id => {
        const el = document.getElementById(id); if (el) el.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
};

function setupGlobalEvents() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.onclick = () => { currentLang = btn.dataset.lang; document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b === btn)); updateUI(); };
    });
    const toggle = document.getElementById('menuToggle'), menu = document.querySelector('.nav-menu');
    toggle.onclick = () => menu.classList.toggle('active');
    
    window.onclick = (e) => {
        const modals = ['supportModal', 'archivePortal', 'foundersModal', 'galleryModal'];
        if (modals.includes(e.target.id)) window.closeAllModals();
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('section').forEach(s => scrollObserver.observe(s));
}

function initCounters() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numEl = entry.target.querySelector('.b3-number');
                if (numEl) {
                    const target = +numEl.dataset.target; let curr = 0;
                    const timer = setInterval(() => {
                        curr += Math.ceil(target / 40); if (curr >= target) { numEl.innerText = target; clearInterval(timer); }
                        else numEl.innerText = curr;
                    }, 30);
                }
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.b3-stat-item').forEach(i => obs.observe(i));
}

function setupScrollUI() {
    const btn = document.getElementById('scrollTopBtn');
    window.onscroll = () => { btn?.classList.toggle('visible', window.scrollY > 600); };
}
window.scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
window.scrollToFooter = () => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });

document.addEventListener('DOMContentLoaded', init);