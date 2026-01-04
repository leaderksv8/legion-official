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
    cache.contacts = await getJSON('data/contacts.json') || {};
    cache.activities = await getJSON('data/activities.json') || [];
    cache.friends = await getJSON('data/friends.json') || [];

    refresh();
    setupContactForm();
    setupScrollLogic();
    setupPartnerCarousel(); 
    setupLanguageSwitcher();
}

function refresh() {
    if (cache.activities.length) render.renderActivities(cache.activities, currentLang);
    if (cache.founders.length) render.renderFounders(cache.founders, currentLang);
    if (cache.stats.length) render.renderStats(cache.stats, currentLang);
    if (cache.partners.length) render.renderPartners(cache.partners);
    if (cache.news.length) render.renderNews(cache.news, currentLang);
    if (cache.stories.length) render.renderStories(cache.stories, currentLang);
    if (cache.friends.length) render.renderFriends(cache.friends, currentLang);
    
    render.renderGallery(['images/001.jpg', 'images/001.jpg', 'images/001.jpg', 'images/001.jpg']);

    const c = cache.contacts;
    if (c && c.phone) {
        const block = document.getElementById('contacts-content');
        if (block) {
            block.innerHTML = `
                <p style="margin-bottom:12px;"><i class="fas fa-map-marker-alt" style="color:var(--accent)"></i> Бучанський район, Київська обл.</p>
                <p style="margin-bottom:12px;"><i class="fas fa-phone" style="color:var(--accent)"></i> ${c.phone}</p>
                <p style="margin-bottom:12px;"><i class="fas fa-paper-plane" style="color:var(--accent)"></i> @legion_bucha</p>
                <p style="margin-bottom:12px;"><i class="fas fa-envelope" style="color:var(--accent)"></i> ${c.email}</p>`;
        }
    }

    document.querySelectorAll('[data-' + currentLang + ']').forEach(el => { el.innerHTML = el.getAttribute('data-' + currentLang); });
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
    if (!slider || !track) return;
    let isDown = false, startX, scrollLeft, autoScrollSpeed = 0.3, animationId, isPaused = false;
    const startAutoScroll = () => { if (!isPaused && !isDown) { slider.scrollLeft += autoScrollSpeed; if (slider.scrollLeft >= track.scrollWidth / 3) slider.scrollLeft = 0; } animationId = requestAnimationFrame(startAutoScroll); };
    startAutoScroll();
    slider.addEventListener('mouseenter', () => isPaused = true);
    slider.addEventListener('mouseleave', () => isPaused = false);
    const startDrag = (e) => { isDown = true; startX = (e.pageX || e.touches[0].pageX) - slider.offsetLeft; scrollLeft = slider.scrollLeft; };
    const stopDrag = () => { isDown = false; };
    const moveDrag = (e) => { if (!isDown) return; e.preventDefault(); const x = (e.pageX || e.touches[0].pageX) - slider.offsetLeft; slider.scrollLeft = scrollLeft - (x - startX) * 1.5; };
    slider.addEventListener('mousedown', startDrag); window.addEventListener('mouseup', stopDrag); slider.addEventListener('mousemove', moveDrag);
    slider.addEventListener('touchstart', startDrag, {passive: false}); slider.addEventListener('touchend', stopDrag); slider.addEventListener('touchmove', moveDrag, {passive: false});
}

function setupMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('navMenu');
    const links = document.querySelectorAll('.nav-link');
    if (!toggle || !menu) return;
    toggle.onclick = () => { toggle.classList.toggle('active'); menu.classList.toggle('active'); document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : 'auto'; };
    links.forEach(l => l.onclick = () => { toggle.classList.remove('active'); menu.classList.remove('active'); document.body.style.overflow = 'auto'; });
}

function setupScrollLogic() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const observerOptions = { root: null, rootMargin: '-20% 0px -50% 0px', threshold: 0 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const title = entry.target.querySelector('.section-title');
            if (entry.isIntersecting) {
                if (title) title.classList.add('highlight');
                navLinks.forEach(link => { link.classList.remove('active'); if (link.getAttribute('href') === `#${id}`) link.classList.add('active'); });
                if (entry.target.classList.contains('reveal')) entry.target.classList.add('active');
            } else { if (title) title.classList.remove('highlight'); }
        });
    }, observerOptions);
    sections.forEach(section => observer.observe(section));
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
    if (!btn) return;
    window.addEventListener('scroll', () => { if (window.pageYOffset > 400) btn.setAttribute("style", "display: flex !important"); else btn.setAttribute("style", "display: none !important"); });
    btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    if (!form) return;
    form.onsubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(form), submitBtn = document.getElementById('formSubmit');
        submitBtn.disabled = true; submitBtn.innerText = 'Sending...';
        try {
            const res = await fetch("https://formspree.io/f/mqkrvylk", { method: "POST", body: data, headers: { 'Accept': 'application/json' } });
            if (res.ok) { status.style.display = "block"; status.style.color = "#28a745"; status.innerText = "Success!"; form.reset(); }
            else throw new Error();
        } catch (error) { status.style.display = "block"; status.style.color = "#dc3545"; status.innerText = "Error."; }
        finally { submitBtn.disabled = false; submitBtn.innerText = 'Відправити'; }
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