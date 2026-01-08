import { loadTranslations, translatePage } from './i18n.js';
import * as render from './render.js';

let currentLang = 'uk';
let cache = { translations: {}, activities: [], stats: [], partners: [], friends: [], stories: [], news: [], albums: [] };

async function init() {
    try {
        const [t, a, s, p, f, st, n, al] = await Promise.all([
            loadTranslations(),
            fetch('data/activities.json').then(res => res.json()),
            fetch('data/stats.json').then(res => res.json()),
            fetch('data/partners.json').then(res => res.json()),
            fetch('data/friends.json').then(res => res.json()),
            fetch('data/stories.json').then(res => res.json()),
            fetch('data/news.json').then(res => res.json()),
            fetch('data/albums.json').then(res => res.json())
        ]);
        cache = { translations: t, activities: a, stats: s, partners: p, friends: f, stories: st, news: n, albums: al };
        setupLanguageSwitcher();
        setupMobileMenu();
        setupScrollReveal();
        updateUI();
        setupGalleryModal();
        setupParallax();
    } catch (e) { console.error("Init failed:", e); }
}

function updateUI() {
    translatePage(cache.translations, currentLang);
    render.renderActivities(cache.activities, currentLang);
    render.renderStats(cache.stats, currentLang);
    render.renderPartners(cache.partners);
    render.renderFriends(cache.friends, currentLang);
    render.renderStories(cache.stories, currentLang);
    render.renderNews(cache.news, currentLang);
    render.renderAlbums(cache.albums, currentLang);
    initCounters(); 
    setTimeout(() => {
        initPartnersSwiper();
        initVerticalAlbums();
    }, 600);
}

function setupParallax() {
    if (window.innerWidth < 1024) return;
    document.addEventListener("mousemove", (e) => {
        const layers = document.querySelectorAll(".b7-p-layer");
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;
        layers.forEach(layer => {
            const speed = layer.getAttribute('data-speed');
            layer.style.transform = `translateX(${x * speed}px) translateY(${y * speed}px) rotate(${speed * 2}deg)`;
        });
    });
}

function initVerticalAlbums() {
    const isMobile = window.innerWidth < 992;
    
    new Swiper('.b7-albums-swiper', {
        direction: isMobile ? 'horizontal' : 'vertical', // ГОРИЗОНТАЛЬНО НА МОБІЛЬНИХ
        slidesPerView: isMobile ? 1.2 : 2,
        spaceBetween: 20,
        mousewheel: !isMobile,
        grabCursor: true,
        nested: true, // ВАЖЛИВО: не перехоплює скрол сторінки
        autoplay: { delay: 3000 }
    });
}

window.openGallery = (id) => {
    const album = cache.albums.find(a => a.id === id);
    if (!album) return;
    const wrapper = document.getElementById('modal-gallery-wrapper');
    wrapper.innerHTML = album.photos.map(src => `<div class="swiper-slide"><img src="${src}"></div>`).join('');
    document.getElementById('galleryModal').style.display = 'flex';
    if (window.gallerySwiper) window.gallerySwiper.destroy();
    window.gallerySwiper = new Swiper('.b7-gallery-swiper', { navigation: { nextEl: '.b7-swiper-next', prevEl: '.b7-swiper-prev' }, loop: true });
};

function setupGalleryModal() {
    const modal = document.getElementById('galleryModal');
    const close = document.querySelector('.b7-modal-close');
    if (close) close.onclick = () => modal.style.display = 'none';
}

function initPartnersSwiper() {
    if (window.partnersSwiper) window.partnersSwiper.destroy(true, true);
    window.partnersSwiper = new Swiper('.b4-swiper-container', {
        loop: true, centeredSlides: true, speed: 1000, grabCursor: true,
        autoplay: { delay: 2500, disableOnInteraction: false },
        navigation: { nextEl: '.b4-next-unique', prevEl: '.b4-prev-unique' },
        breakpoints: { 320: { slidesPerView: 1.5, spaceBetween: 20 }, 768: { slidesPerView: 3, spaceBetween: 30 }, 1200: { slidesPerView: 5, spaceBetween: 40 } },
        loopedSlides: 10, loopAdditionalSlides: 10, observer: true, observeParents: true,
    });
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
    }, { threshold: 0.15 });
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