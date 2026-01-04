import * as render from './render.js';

let currentLang = 'uk';
let cache = { founders: [], stats: [], partners: [], news: [], stories: [], activities: [], friends: [] };

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
    cache.friends = await getJSON('data/friends.json') || [];

    refresh();
    setupContactForm();
    setupScrollLogic();
    setupPartnerCarousel(); 
    setupLanguageSwitcher();
}

function refresh() {
    render.renderActivities(cache.activities, currentLang);
    render.renderFounders(cache.founders, currentLang);
    render.renderStats(cache.stats, currentLang);
    render.renderPartners(cache.partners);
    render.renderNews(cache.news, currentLang);
    render.renderStories(cache.stories, currentLang);
    render.renderFriends(cache.friends, currentLang);
    render.renderGallery(['images/001.jpg', 'images/001.jpg', 'images/001.jpg', 'images/001.jpg']);

    // ПОВНИЙ ПЕРЕКЛАД СТАТИКИ
    document.querySelectorAll('[data-uk], [data-en]').forEach(el => {
        const text = el.getAttribute(`data-${currentLang}`);
        if (text) el.innerHTML = text;
    });

    // ПЕРЕКЛАД ПЛЕЙСХОЛДЕРІВ
    document.querySelectorAll('[data-uk-placeholder]').forEach(el => {
        const ph = el.getAttribute(`data-${currentLang}-placeholder`);
        if (ph) el.placeholder = ph;
    });

    setupCounters();
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
    const prev = document.getElementById('prevPartner');
    const next = document.getElementById('nextPartner');
    if (!slider || !track) return;

    let autoScrollSpeed = 0.5;
    let animationId;
    let isPaused = false;

    const startAutoScroll = () => {
        if (!isPaused) {
            slider.scrollLeft += autoScrollSpeed;
            if (slider.scrollLeft >= track.scrollWidth / 3) slider.scrollLeft = 0;
        }
        animationId = requestAnimationFrame(startAutoScroll);
    };

    startAutoScroll();

    slider.addEventListener('mouseenter', () => isPaused = true);
    slider.addEventListener('mouseleave', () => isPaused = false);

    if (prev) prev.onclick = () => { slider.scrollLeft -= 300; };
    if (next) next.onclick = () => { slider.scrollLeft += 300; };
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
                document.querySelectorAll('.nav-menu a').forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { threshold: 0.2 });
    sections.forEach(s => observer.observe(s));
}

function setupCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(c => {
        const target = +c.dataset.target;
        let count = 0;
        const update = () => {
            if (count < target) {
                count += Math.ceil(target / 50);
                c.innerText = count > target ? target : count;
                setTimeout(update, 30);
            } else c.innerText = target;
        };
        update();
    });
}

function setupBackToTop() {
    const btn = document.getElementById("backToTop");
    window.onscroll = () => { if (window.pageYOffset > 400) btn.setAttribute("style", "display: flex !important"); else btn.setAttribute("style", "display: none !important"); };
    btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.onsubmit = async (e) => {
        e.preventDefault();
        alert(currentLang === 'uk' ? "Дякуємо! Ваше повідомлення надіслано." : "Thank you! Message sent.");
        form.reset();
    };
}

window.openBio = (id) => {
    const f = cache.founders.find(x => x.id === id);
    if (!f) return;
    const m = document.getElementById('bioModal'), data = document.getElementById('modal-data');
    data.innerHTML = `<div class="bio-flex"><img src="${f.img}" class="bio-img"><div><h2 style="color:var(--primary); font-size: 1.5rem;">${f.name[currentLang]}</h2><p style="color:var(--accent); font-weight:700; margin-bottom:15px;">${f.role[currentLang]}</p><div style="line-height:1.8;">${f.bio[currentLang]}</div><p style="margin-top:20px; border-top:1px solid #eee; padding-top:10px;"><b>TG:</b> ${f.tg} | <b>Тел:</b> ${f.phone}</p></div></div>`;
    m.style.display = 'flex'; setTimeout(() => m.classList.add('active'), 10); document.body.style.overflow = 'hidden';
};

window.openFullImage = (src) => {
    const m = document.getElementById('bioModal'), data = document.getElementById('modal-data');
    data.innerHTML = `<div style="text-align:center;"><img src="${src}" style="max-width:100%; max-height:85vh; border-radius:20px; box-shadow:0 20px 50px rgba(0,0,0,0.5); object-fit:contain;"></div>`;
    m.style.display = 'flex'; setTimeout(() => m.classList.add('active'), 10); document.body.style.overflow = 'hidden';
};

const closeModal = () => { const m = document.getElementById('bioModal'); if (m) { m.classList.remove('active'); setTimeout(() => { m.style.display = 'none'; document.body.style.overflow = 'auto'; }, 400); } };
document.querySelector('.close-modal').onclick = closeModal;
window.onclick = (e) => { if (e.target === document.getElementById('bioModal')) closeModal(); };
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

document.addEventListener('DOMContentLoaded', init);