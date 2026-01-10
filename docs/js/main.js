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
    } catch (e) { console.error("Init Error:", e); }
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

window.closeAllModals = () => {
    ['galleryModal', 'foundersModal', 'archivePortal'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
};

window.openFounderBio = (id, event) => {
    event?.stopPropagation();
    const f = cache.founders.find(x => x.id === id);
    if (!f) return;
    document.getElementById('f-modal-name').innerText = f.name;
    document.getElementById('f-modal-role').innerText = f.role[currentLang];
    document.getElementById('f-modal-desc').innerText = f.bio[currentLang];
    const modal = document.getElementById('foundersModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
};

window.toggleAllAlbums = (e) => {
    e?.stopPropagation();
    const portal = document.getElementById('archivePortal');
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

function setupScrollUI() {
    const btn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => { btn?.classList.toggle('visible', window.scrollY > 600); });
}

window.scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
window.scrollToFooter = () => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });

function initCounters() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numEl = entry.target.querySelector('.b3-number');
                if (numEl) {
                    const target = +numEl.dataset.target;
                    let curr = 0;
                    const timer = setInterval(() => {
                        curr += target / 40;
                        if (curr >= target) { numEl.innerText = target; clearInterval(timer); }
                        else numEl.innerText = Math.ceil(curr);
                    }, 30);
                }
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.b3-stat-item').forEach(i => obs.observe(i));
}

function setupGlobalEvents() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.onclick = () => { currentLang = btn.dataset.lang; updateUI(); };
    });
    const toggle = document.getElementById('menuToggle'), menu = document.getElementById('navMenu');
    if (toggle && menu) toggle.onclick = () => menu.classList.toggle('active');
    
    window.addEventListener('click', (e) => {
        if (['galleryModal', 'foundersModal', 'archivePortal'].includes(e.target.id)) window.closeAllModals();
    });
}

document.addEventListener('DOMContentLoaded', init);