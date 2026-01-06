import * as render from './render.js';

let currentLang = 'uk';
let cache = { founders: [], stats: [], partners: [], news: [], stories: [], contacts: {}, activities: [], friends: [] };

async function getJSON(url) {
    try {
        const r = await fetch(url);
        if (!r.ok) return null;
        return await r.json();
    } catch (e) { return null; }
}

async function init() {
    setupMobileMenu(); 
    setupBackToTop();
    
    // Завантаження всіх даних
    cache.founders = await getJSON('data/founders.json') || [];
    cache.stats = await getJSON('data/stats.json') || [];
    cache.partners = await getJSON('data/partners.json') || [];
    cache.news = await getJSON('data/news.json') || [];
    cache.stories = await getJSON('data/stories.json') || [];
    cache.activities = await getJSON('data/activities.json') || [];

    refresh();
    setupContactForm();
    setupScrollLogic();
    setupPartnerCarousel(); 
    setupLanguageSwitcher();
    setupVerticalCarousels();
}

function refresh() {
    render.renderActivities(cache.activities, currentLang);
    render.renderFounders(cache.founders, currentLang);
    render.renderStats(cache.stats, currentLang);
    render.renderPartners(cache.partners);
    render.renderNews(cache.news, currentLang);
    render.renderStories(cache.stories, currentLang);
    render.renderGallery(['images/001.jpg', 'images/001.jpg', 'images/001.jpg', 'images/001.jpg']);

    // ПОВНИЙ ПЕРЕКЛАД СТАТИКИ ТА БРЕНДУ
    document.querySelectorAll('[data-uk], [data-en]').forEach(el => {
        const text = el.getAttribute(`data-${currentLang}`);
        if (text) el.innerHTML = text;
    });

    setupCounters();
}

function setupVerticalCarousels() {
    const ids = ['newsCarousel', 'albumsCarousel'];
    ids.forEach(id => {
        const container = document.getElementById(id);
        const track = container ? container.querySelector('.vertical-track') : null;
        if (!track) return;
        let scrollPos = 0, isPaused = false;
        container.onmouseenter = () => isPaused = true;
        container.onmouseleave = () => isPaused = false;
        function scroll() { if (!isPaused) { scrollPos += 0.5; if (scrollPos >= track.scrollHeight / 2) scrollPos = 0; container.scrollTop = scrollPos; } requestAnimationFrame(scroll); }
        requestAnimationFrame(scroll);
    });
}

function setupLanguageSwitcher() {
    const btns = document.querySelectorAll('.lang-btn');
    btns.forEach(btn => {
        btn.onclick = (e) => {
            currentLang = e.currentTarget.dataset.lang;
            btns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll(`.lang-btn[data-lang="${currentLang}"]`).forEach(b => b.classList.add('active'));
            refresh();
        };
    });
}

function setupPartnerCarousel() {
    const slider = document.getElementById('partnersSlider');
    const track = document.getElementById('partners-track');
    if (!slider || !track) return;
    let isDown = false, startX, scrollLeft, autoScrollSpeed = 0.5, animationId, isPaused = false;
    const startAutoScroll = () => { if (!isPaused && !isDown) { slider.scrollLeft += autoScrollSpeed; if (slider.scrollLeft >= track.scrollWidth / 3) slider.scrollLeft = 0; } animationId = requestAnimationFrame(startAutoScroll); };
    startAutoScroll();
    slider.onmouseenter = () => isPaused = true;
    slider.onmouseleave = () => isPaused = false;
    const startDrag = (e) => { isDown = true; startX = (e.pageX || e.touches[0].pageX) - slider.offsetLeft; scrollLeft = slider.scrollLeft; };
    const stopDrag = () => { isDown = false; };
    const moveDrag = (e) => { if (!isDown) return; e.preventDefault(); const x = (e.pageX || e.touches[0].pageX) - slider.offsetLeft; slider.scrollLeft = scrollLeft - (x - startX) * 1.5; };
    slider.onmousedown = startDrag; window.onmouseup = stopDrag; slider.onmousemove = moveDrag;
}

function setupMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;
    toggle.onclick = () => { toggle.classList.toggle('active'); menu.classList.toggle('active'); document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : 'auto'; };
}

function setupScrollLogic() {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                const id = entry.target.getAttribute('id');
                document.querySelectorAll('.nav-menu a').forEach(a => { a.classList.toggle('active', a.getAttribute('href') === `#${id}`); });
                const title = entry.target.querySelector('.section-title');
                if (title) title.classList.add('highlight');
            } else { const title = entry.target.querySelector('.section-title'); if (title) title.classList.remove('highlight'); }
        });
    }, { threshold: 0.2 });
    sections.forEach(s => observer.observe(s));
}

function setupCounters() {
    const counters = document.querySelectorAll('.counter');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (en.isIntersecting) {
                const target = +en.target.dataset.target;
                let cValue = 0;
                const step = () => { if (cValue < target) { cValue += Math.ceil(target / 40); en.target.innerText = cValue > target ? target : cValue; setTimeout(step, 30); } else en.target.innerText = target; };
                step(); obs.unobserve(en.target);
            }
        });
    });
    counters.forEach(c => obs.observe(c));
}

function setupBackToTop() {
    const btn = document.getElementById("backToTop");
    window.onscroll = () => { if (window.pageYOffset > 400) btn.setAttribute("style", "display: flex !important"); else btn.setAttribute("style", "display: none !important"); };
    btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', init);