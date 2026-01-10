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
    } catch (e) { console.error("Global System Failure", e); }
}

function updateUI() {
    // HARD SYNC TRANSLATION
    translatePage(cache.translations, currentLang);
    
    // SAFE RENDER
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

window.openSupportModal = (e) => { e.stopPropagation(); document.getElementById('supportModal').style.display = 'flex'; };
window.closeAllModals = () => {
    ['galleryModal', 'foundersModal', 'archivePortal', 'supportModal'].forEach(id => {
        const el = document.getElementById(id); if (el) el.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
};

function setupGlobalEvents() {
    // LANGUAGE PERMANENT FIX
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            currentLang = btn.dataset.lang;
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b === btn));
            updateUI();
        };
    });

    const toggle = document.getElementById('menuToggle'), menu = document.getElementById('navMenu');
    if (toggle && menu) toggle.onclick = () => menu.classList.toggle('active');

    window.onclick = (e) => {
        if (['galleryModal', 'foundersModal', 'archivePortal', 'supportModal'].includes(e.target.id)) window.closeAllModals();
    };
    
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('section').forEach(s => obs.observe(s));
}

// REST OF LOGIC (SCROLL, COUNTERS)
function setupScrollUI() {
    const btn = document.getElementById('scrollTopBtn');
    window.onscroll = () => { btn?.classList.toggle('visible', window.scrollY > 600); };
}
window.scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
window.scrollToFooter = () => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });

function initCounters() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numEl = entry.target.querySelector('.b3-number');
                if (numEl) {
                    const target = +numEl.dataset.target; let curr = 0;
                    const timer = setInterval(() => {
                        curr += target / 40; if (curr >= target) { numEl.innerText = target; clearInterval(timer); }
                        else numEl.innerText = Math.ceil(curr);
                    }, 30);
                }
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.b3-stat-item').forEach(i => obs.observe(i));
}

document.addEventListener('DOMContentLoaded', init);