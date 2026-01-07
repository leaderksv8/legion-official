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
    } catch (e) { console.error("Initialization failed:", e); }
}

function updateUI() {
    // Рендер всіх блоків
    translatePage(cache.translations, currentLang);
    render.renderActivities(cache.activities, currentLang);
    render.renderStats(cache.stats, currentLang);
    render.renderPartners(cache.partners);
    render.renderFriends(cache.friends, currentLang);
    render.renderStories(cache.stories, currentLang);
    render.renderNews(cache.news, currentLang);
    render.renderAlbums(cache.albums, currentLang);
    
    initCounters(); 

    // КЛЮЧОВИЙ ФІКС: Sequential initialization (Послідовний запуск)
    // Спочатку запускаємо Swiper, даємо йому 500мс, потім запускаємо Блок 7
    setTimeout(() => {
        initPartnersSwiper();
    }, 300);

    setTimeout(() => {
        initVerticalCarousels();
    }, 800);
}

function initPartnersSwiper() {
    const swiperElem = document.querySelector('.b4-swiper-container');
    if (!swiperElem) return;

    if (window.partnersSwiper) {
        window.partnersSwiper.destroy(true, true);
    }

    window.partnersSwiper = new Swiper('.b4-swiper-container', {
        loop: true,
        centeredSlides: true,
        speed: 1000,
        grabCursor: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.b4-next-unique',
            prevEl: '.b4-prev-unique',
        },
        // Фіксована кількість слайдів для стабільності математики Swiper
        breakpoints: {
            320: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 30 },
            1200: { slidesPerView: 5, spaceBetween: 40 }
        },
        // Масштабне клонування для запобігання зупинкам
        loopedSlides: 10,
        loopAdditionalSlides: 10,
        observer: true,
        observeParents: true,
    });
}

function initVerticalCarousels() {
    const configs = [{ id: 'newsViewport', trackId: 'news-container' }, { id: 'albumsViewport', trackId: 'albums-container' }];
    configs.forEach(config => {
        const viewport = document.getElementById(config.id);
        const track = document.getElementById(config.trackId);
        if (!viewport || !track) return;
        
        let scrollPos = 0;
        const speed = 0.5;
        let isPaused = false;

        viewport.onmouseenter = () => isPaused = true;
        viewport.onmouseleave = () => isPaused = false;

        function animate() {
            if (!isPaused) {
                scrollPos += speed;
                // Скидання на середину (так як дані в render.js дубльовані)
                if (scrollPos >= track.scrollHeight / 2) {
                    scrollPos = 0;
                }
                viewport.scrollTop = scrollPos;
            }
            requestAnimationFrame(animate);
        }
        animate();
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