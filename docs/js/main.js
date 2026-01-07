import { loadTranslations, translatePage } from './i18n.js';
import { renderActivities, renderStats } from './render.js';

let currentLang = 'uk';
let cache = { translations: {}, activities: [], stats: [] };

async function init() {
    const [t, a, s] = await Promise.all([
        loadTranslations(),
        fetch('data/activities.json').then(res => res.json()),
        fetch('data/stats.json').then(res => res.json())
    ]);
    cache.translations = t;
    cache.activities = a;
    cache.stats = s;

    setupLanguageSwitcher();
    setupMobileMenu();
    setupScrollReveal();
    updateUI();
}

function updateUI() {
    translatePage(cache.translations, currentLang);
    renderActivities(cache.activities, currentLang);
    renderStats(cache.stats, currentLang);
    initCounters(); 
}

function initCounters() {
    const counters = document.querySelectorAll('.b3-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.dataset.target;
                const duration = 2000; // 2 секунди
                const stepTime = 30;
                const steps = duration / stepTime;
                const increment = target / steps;
                let current = 0;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        entry.target.innerText = target;
                        clearInterval(timer);
                    } else {
                        entry.target.innerText = Math.ceil(current);
                    }
                }, stepTime);
                
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