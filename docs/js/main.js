import { loadTranslations, translatePage } from './i18n.js';
import { renderActivities, renderStats, renderPartners } from './render.js';

let currentLang = 'uk';
let cache = { translations: {}, activities: [], stats: [], partners: [] };

async function init() {
    try {
        const [t, a, s, p] = await Promise.all([
            loadTranslations(),
            fetch('data/activities.json').then(res => res.json()),
            fetch('data/stats.json').then(res => res.json()),
            fetch('data/partners.json').then(res => res.json())
        ]);
        cache.translations = t; cache.activities = a; cache.stats = s; cache.partners = p;
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
    initCounters(); 
    setTimeout(initPartnersSwiper, 300);
}

function initPartnersSwiper() {
    if (window.partnersSwiper) window.partnersSwiper.destroy();

    window.partnersSwiper = new Swiper('.b4-swiper', {
        loop: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: 30,
        grabCursor: true,
        speed: 800,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.b4-next-btn',
            prevEl: '.b4-prev-btn',
        },
        // ФІКС БЕСКІНЕЧНОСТІ: Додаємо велику кількість клонів слайдів
        loopedSlides: 12,
        loopAdditionalSlides: 12,
        // ФІКС ЗАХВАТУ: Запобігаємо стрибкам при кліку
        touchStartPreventDefault: false,
        simulateTouch: true,
        threshold: 5, // Реагувати на рух більше 5 пікселів
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
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
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