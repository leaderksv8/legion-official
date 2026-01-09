import { loadTranslations, translatePage } from './i18n.js';
import * as render from './render.js';

let currentLang = 'uk';
let cache = { translations: {}, activities: [], stats: [], partners: [], team: [], stories: [], news: [], albums: [] };

async function init() {
    try {
        const load = async (url) => {
            const r = await fetch(url);
            return r.ok ? await r.json() : [];
        };
        const [t, a, s, p, tm, st, n, al] = await Promise.all([
            loadTranslations(), load('data/activities.json'), load('data/stats.json'),
            load('data/partners.json'), load('data/team.json'), load('data/stories.json'),
            load('data/news.json'), load('data/albums.json')
        ]);
        cache = { translations: t, activities: a, stats: s, partners: p, team: tm, stories: st, news: n, albums: al };
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
    initCounters(); 
    setTimeout(() => initPartnersSwiper(), 600);
}

function initPartnersSwiper() {
    if (window.partnersSwiper) window.partnersSwiper.destroy(true, true);
    
    window.partnersSwiper = new Swiper('.b4-swiper-main', {
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true, // ФІКС: Тримає слайди чітко в межах
        speed: 1000,
        grabCursor: true,
        autoplay: { delay: 3000, disableOnInteraction: false },
        navigation: { nextEl: '.b4-next-btn', prevEl: '.b4-prev-btn' },
        breakpoints: {
            320: { slidesPerView: 1, spaceBetween: 10 }, // ОДИН СЛАЙД ЧІТКО ПО ЦЕНТРУ
            768: { slidesPerView: 2.5, spaceBetween: 30 },
            1200: { slidesPerView: 3.5, spaceBetween: 50 },
            1600: { slidesPerView: 4.5, spaceBetween: 60 }
        },
        loopedSlides: 10,
        observer: true,
        observeParents: true
    });
}

window.toggleAllAlbums = () => {
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
    window.gallerySwiper = new Swiper('.b7-gallery-swiper-engine', {
        navigation: { nextEl: '.b7-swiper-nav.next', prevEl: '.b7-swiper-nav.prev' }, loop: true
    });
};

function setupGalleryModal() {
    const modal = document.getElementById('galleryModal');
    if (modal) window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; };
}

function initCounters() {
    const counters = document.querySelectorAll('.b3-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.dataset.target;
                let current = 0;
                const timer = setInterval(() => {
                    current += target / 50;
                    if (current >= target) { entry.target.innerText = target; clearInterval(timer); }
                    else { entry.target.innerText = Math.ceil(current); }
                }, 30);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
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