import { loadTranslations, translatePage } from './i18n.js';

let currentLang = 'uk';
let translations = {};

async function init() {
    translations = await loadTranslations();
    setupLanguageSwitcher();
    setupMobileMenu();
    updateUI();
}

function updateUI() {
    translatePage(translations, currentLang);
}

function setupLanguageSwitcher() {
    const btns = document.querySelectorAll('.lang-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentLang = btn.dataset.lang;
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateUI();
        });
    });
}

function setupMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('navMenu');
    if (toggle && menu) {
        toggle.onclick = () => {
            menu.classList.toggle('active');
            toggle.classList.toggle('open');
        };
    }
}

document.addEventListener('DOMContentLoaded', init);