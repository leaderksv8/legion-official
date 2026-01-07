import { loadTranslations, translatePage } from './i18n.js';
import { renderActivities, renderStats, renderPartners, renderFriends, renderStories } from './render.js';

let currentLang = 'uk';
let cache = { translations: {}, activities: [], stats: [], partners: [], friends: [], stories: [] };

async function init() {
    try {
        const [t, a, s, p, f, st] = await Promise.all([
            loadTranslations(),
            fetch('data/activities.json').then(res => res.json()),
            fetch('data/stats.json').then(res => res.json()),
            fetch('data/partners.json').then(res => res.json()),
            fetch('data/friends.json').then(res => res.json()),
            fetch('data/stories.json').then(res => res.json())
        ]);
        cache.translations = t;
        cache.activities = a;
        cache.stats = s;
        cache.partners = p;
        cache.friends = f;
        cache.stories = st;

        setupLanguageSwitcher();
        setupMobileMenu();
        setupScrollReveal();
        updateUI();
    } catch (e) { console.error("Init error:", e); }
}

function updateUI() {
    translatePage(cache.translations, currentLang);
    renderActivities(cache.activities, currentLang);
    renderStats(cache.stats, currentLang);
    renderPartners(cache.partners);
    renderFriends(cache.friends, currentLang);
    renderStories(cache.stories, currentLang);
    initCounters(); 
    setTimeout(initPartnersSwiper, 300);
}

function initPartnersSwiper() {
    if (window.partnersSwiper) window.partnersSwiper.destroy(true, true);
    window.partnersSwiper = new Swiper('.b4-swiper', {
        loop: true,
        centeredSlides: true,
        speed: 1000,
        autoplay: { delay: 2500, disableOnInteraction: false },
        navigation: { nextEl: '.b4-next-btn', prevEl: '.b4-prev-btn' },
        breakpoints: {
            320: { slidesPerView: 1, spaceBetween: 20 },
            640: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: 3, spaceBetween: 40 },
            1440: { slidesPerView: 5, spaceBetween: 50 }
        },
        observer: true,
        observeParents: true,
        loopAdditionalSlides: 10,
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
                    if (current >= target) {
                        entry.target.innerText = target;
                        clearInterval(timer);
                    } else { entry.target.innerText = Math.ceil(current); }
                }, 30);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
}

function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
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