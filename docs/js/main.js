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
        const [t, a, s, p, tm, st, n, al, fnd] = await Promise.all([
            loadTranslations(), load('data/activities.json'), load('data/stats.json'),
            load('data/partners.json'), load('data/team.json'), load('data/stories.json'),
            load('data/news.json'), load('data/albums.json'), load('data/founders.json')
        ]);
        cache = { translations: t, activities: a, stats: s, partners: p, team: tm, stories: st, news: n, albums: al, founders: fnd };
        setupLanguageSwitcher(); setupMobileMenu(); setupScrollReveal(); updateUI(); setupGalleryModal();
    } catch (e) { console.error("Init Error:", e); }
}

function updateUI() {
    translatePage(cache.translations, currentLang);
    render.renderActivities(cache.activities, currentLang);
    render.renderStats(cache.stats, currentLang);
    render.renderPartners(cache.partners);
    render.renderTeam(cache.team, currentLang);
    render.renderStories(cache.stories, currentLang);
    render.renderNews(cache.news, currentLang);
    render.renderAlbums(cache.albums, currentLang);
    render.renderFounders(cache.founders, currentLang);
    initCounters(); 
    setTimeout(() => initPartnersSwiper(), 600);
}

// МОДАЛКА СПІВЗАСНОВНИКІВ
window.openFounderBio = (id) => {
    const f = cache.founders.find(x => x.id === id);
    if (!f) return;
    document.getElementById('f-modal-img').src = f.img;
    document.getElementById('f-modal-name').innerText = f.name;
    document.getElementById('f-modal-role').innerText = f.role[currentLang];
    document.getElementById('f-modal-desc').innerText = f.bio[currentLang];
    document.getElementById('foundersModal').style.display = 'flex';
};

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
    if (window.gallerySwiper) window.gallerySwiper.destroy();
    window.gallerySwiper = new Swiper('.b7-gallery-swiper-engine', { navigation: { nextEl: '.next', prevEl: '.prev' }, loop: true });
};

function setupGalleryModal() {
    const m1 = document.getElementById('galleryModal');
    const m2 = document.getElementById('foundersModal');
    window.onclick = (e) => { 
        if (e.target == m1) m1.style.display = 'none'; 
        if (e.target == m2) m2.style.display = 'none'; 
    };
}

function initPartnersSwiper() {
    if (window.partnersSwiper) window.partnersSwiper.destroy(true, true);
    window.partnersSwiper = new Swiper('.b4-swiper-container', {
        loop: true, centeredSlides: true, speed: 1000, grabCursor: true,
        autoplay: { delay: 3000, disableOnInteraction: false },
        navigation: { nextEl: '.b4-next-unique', prevEl: '.b4-prev-unique' },
        breakpoints: { 320: { slidesPerView: 1.5, spaceBetween: 20 }, 768: { slidesPerView: 3, spaceBetween: 30 }, 1200: { slidesPerView: 5, spaceBetween: 40 } },
        loopedSlides: 10, observer: true, observeParents: true
    });
}

function initCounters() {
    const statItems = document.querySelectorAll('.b3-stat-item');
    statItems.forEach(item => {
        const numEl = item.querySelector('.b3-number');
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

function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('section').forEach(s => observer.observe(s));
}

function setupLanguageSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentLang = e.target.dataset.lang;
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b === e.target));
            updateUI();
        });
    });
}

function setupMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('navMenu');
    if (toggle && menu) toggle.onclick = () => menu.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', init);