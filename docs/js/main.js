import { loadTranslations, translatePage } from './i18n.js';
import * as render from './render.js';

let currentLang = 'uk';
let cache = { translations: {}, activities: [], stats: [], partners: [], team: [], stories: [], news: [], albums: [], founders: [] };

async function init() {
    try {
        const load = async (url) => {
            try { const r = await fetch(url); return r.ok ? await r.json() : []; } catch (e) { return []; }
        };

        const results = await Promise.allSettled([
            loadTranslations(), load('data/activities.json'), load('data/stats.json'),
            load('data/partners.json'), load('data/team.json'), load('data/stories.json'),
            load('data/news.json'), load('data/albums.json'), load('data/founders.json')
        ]);

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
    } catch (e) { console.error("Global System Failure", e); }
}

function updateUI() {
    const safeExec = (name, fn) => { 
        try { fn(); } catch(e) { console.warn(`Block ${name} failed to render.`); } 
    };

    // Переклад працює нативно для всього сайту
    safeExec("Translate", () => translatePage(cache.translations, currentLang));
    
    // Рендеримо кожен блок незалежно
    safeExec("Activities", () => render.renderActivities(cache.activities, currentLang));
    safeExec("Stats", () => render.renderStats(cache.stats, currentLang));
    safeExec("Partners", () => render.renderPartners(cache.partners));
    safeExec("Team", () => render.renderTeam(cache.team, currentLang));
    safeExec("Stories", () => render.renderStories(cache.stories, currentLang));
    safeExec("News", () => render.renderNews(cache.news, currentLang));
    safeExec("Albums", () => render.renderAlbums(cache.albums, currentLang));
    safeExec("Founders", () => render.renderFounders(cache.founders, currentLang));
    
    // Ініціалізація динамічних модулів
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
    const modal = document.getElementById('foundersModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
};

function setupGlobalEvents() {
    // Перемикач мов
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.onclick = () => {
            currentLang = btn.dataset.lang;
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b === btn));
            updateUI();
        };
    });

    const toggle = document.getElementById('menuToggle'), menu = document.getElementById('navMenu');
    if (toggle && menu) toggle.onclick = () => menu.classList.toggle('active');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('section').forEach(s => observer.observe(s));
}

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

function setupScrollUI() {
    const btn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => { if (window.scrollY > 600) btn?.classList.add('visible'); else btn?.classList.remove('visible'); });
}

window.scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
window.scrollToFooter = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

document.addEventListener('DOMContentLoaded', init);