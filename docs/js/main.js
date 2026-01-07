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
    setTimeout(initPartnersCarousel, 500);
}

function initPartnersCarousel() {
    const slider = document.getElementById('partnersSlider');
    const track = document.getElementById('partners-track');
    if (!slider || !track) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let autoScrollSpeed = 0.7;
    let isPaused = false;

    // Автопрокрутка
    function step() {
        if (!isPaused && !isDown) {
            slider.scrollLeft += autoScrollSpeed;
            if (slider.scrollLeft >= track.scrollWidth / 3) {
                slider.scrollLeft = 0;
            }
        }
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);

    // Взаємодія мишкою
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        isPaused = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        isPaused = false;
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        isPaused = false;
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // Швидкість скролу мишкою
        slider.scrollLeft = scrollLeft - walk;
    });

    // Взаємодія тачем (телефон)
    slider.addEventListener('touchstart', () => { isPaused = true; });
    slider.addEventListener('touchend', () => { isPaused = false; });
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