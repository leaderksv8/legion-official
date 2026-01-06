import { loadTranslations, translatePage } from './i18n.js';
import { renderActivities } from './render.js';

let currentLang = 'uk';
let cache = { translations: {}, activities: [] };

async function init() {
    const [t, a] = await Promise.all([
        loadTranslations(),
        fetch('data/activities.json').then(res => res.json())
    ]);
    cache.translations = t;
    cache.activities = a;

    setupLanguageSwitcher();
    setupMobileMenu();
    updateUI();
}

function updateUI() {
    translatePage(cache.translations, currentLang);
    renderActivities(cache.activities, currentLang);
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