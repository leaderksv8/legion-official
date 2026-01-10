import { loadTranslations, translatePage } from './i18n.js';
import * as render from './render.js';

let currentLang = 'uk';
let cache = { translations: {}, activities: [], stats: [], partners: [], team: [], stories: [], news: [], albums: [], founders: [] };

async function init() {
    try {
        const load = async (url) => {
            const r = await fetch(url);
            return r.ok ? await r.json() : [];
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
    } catch (e) { console.error("Critical System Failure", e); }
}

function updateUI() {
    // 1. ПЕРЕКЛАД (HARD SYNC)
    translatePage(cache.translations, currentLang);
    
    // 2. РЕНДЕР (ІЗОЛЬОВАНО)
    const blocks = [
        () => render.renderActivities(cache.activities, currentLang),
        () => render.renderStats(cache.stats, currentLang),
        () => render.renderPartners(cache.partners),
        () => render.renderTeam(cache.team, currentLang),
        () => render.renderStories(cache.stories, currentLang),
        () => render.renderNews(cache.news, currentLang),
        () => render.renderAlbums(cache.albums, currentLang),
        () => render.renderFounders(cache.founders, currentLang)
    ];
    
    blocks.forEach(b => { try { b(); } catch(e) {} });

    initCounters();
    setupScrollUI();
}

window.openSupportModal = () => document.getElementById('supportModal').style.display = 'flex';
window.toggleAllAlbums = () => document.getElementById('archivePortal').style.display = 'flex';

window.closeAllModals = () => {
    ['supportModal', 'archivePortal', 'foundersModal', 'galleryModal'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
};

function setupGlobalEvents() {
    // LANGUAGE SWITCHER FIX
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            currentLang = btn.dataset.lang;
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b === btn));
            updateUI();
        };
    });

    const toggle = document.getElementById('menuToggle'), menu = document.querySelector('.nav-menu');
    if (toggle) toggle.onclick = () => menu.classList.toggle('active');

    window.onclick = (e) => {
        if (['supportModal', 'archivePortal', 'foundersModal', 'galleryModal'].includes(e.target.id)) window.closeAllModals();
    };

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('section').forEach(s => obs.observe(s));
}

function initCounters() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numEl = entry.target.querySelector('.b3-number');
                if (numEl) {
                    const target = +numEl.dataset.target; let curr = 0;
                    const timer = setInterval(() => {
                        curr += Math.ceil(target / 40);
                        if (curr >= target) { numEl.innerText = target; clearInterval(timer); }
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

document.addEventListener('DOMContentLoaded', init);