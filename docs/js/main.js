import * as render from './render.js';

let currentLang = 'uk';
let cache = {
    founders: [], stats: [], partners: [], news: [], stories: [], contacts: {}, activities: []
};

async function getJSON(url) {
    try {
        const r = await fetch(url);
        if (!r.ok) return null;
        return await r.json();
    } catch (e) {
        return null;
    }
}

async function init() {
    cache.founders = await getJSON('data/founders.json') || [];
    cache.stats = await getJSON('data/stats.json') || [];
    cache.partners = await getJSON('data/partners.json') || [];
    cache.news = await getJSON('data/news.json') || [];
    cache.stories = await getJSON('data/stories.json') || [];
    cache.contacts = await getJSON('data/contacts.json') || {};
    cache.activities = await getJSON('data/activities.json') || [];

    refresh();
    setupBackToTop();
    setupContactForm();
}

function refresh() {
    if (cache.activities.length) render.renderActivities(cache.activities, currentLang);
    if (cache.founders.length) render.renderFounders(cache.founders, currentLang);
    if (cache.stats.length) render.renderStats(cache.stats, currentLang);
    if (cache.partners.length) render.renderPartners(cache.partners);
    if (cache.news.length) render.renderNews(cache.news, currentLang);
    if (cache.stories.length) render.renderStories(cache.stories, currentLang);
    
    render.renderGallery([
        'images/001.jpg',
        'https://via.placeholder.com/400x300?text=Захід+1',
        'https://via.placeholder.com/400x300?text=Захід+2',
        'https://via.placeholder.com/400x300?text=Захід+3'
    ]);

    const c = cache.contacts;
    if (c && c.phone) {
        const block = document.getElementById('contacts-content');
        if (block) {
            block.innerHTML = `
                <p><i class="fas fa-phone"></i> ${c.phone}</p>
                <p><i class="fas fa-envelope"></i> ${c.email}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${c.address[currentLang]}</p>`;
        }
    }

    document.querySelectorAll('[data-' + currentLang + ']').forEach(el => {
        el.innerHTML = el.getAttribute('data-' + currentLang);
    });

    setupCounters();
}

function setupCounters() {
    const counters = document.querySelectorAll('.counter');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (en.isIntersecting) {
                const target = +en.target.dataset.target;
                let cValue = 0;
                const step = () => {
                    if (cValue < target) {
                        cValue += target / 40;
                        en.target.innerText = Math.ceil(cValue);
                        setTimeout(step, 30);
                    } else en.target.innerText = target;
                };
                step();
                obs.unobserve(en.target);
            }
        });
    });
    counters.forEach(c => obs.observe(c));
}

function setupBackToTop() {
    const btn = document.getElementById("backToTop");
    if (!btn) return;

    window.addEventListener('scroll', () => {
        // Перевіряємо скрол через різні властивості для надійності
        const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollPos > 300) {
            btn.style.display = "block";
        } else {
            btn.style.display = "none";
        }
    });

    btn.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
}

function setupContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');

    if (!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const submitBtn = document.getElementById('formSubmit');
        
        submitBtn.disabled = true;
        const originalText = submitBtn.innerText;
        submitBtn.innerText = currentLang === 'uk' ? 'Надсилається...' : 'Sending...';

        try {
            const response = await fetch("https://formspree.io/f/mqkrvylk", {
                method: "POST",
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                status.style.display = "block";
                status.style.color = "#28a745";
                status.innerText = currentLang === 'uk' ? "Дякуємо! Повідомлення надіслано." : "Thanks! Your message has been sent.";
                form.reset();
            } else {
                throw new Error();
            }
        } catch (error) {
            status.style.display = "block";
            status.style.color = "#dc3545";
            status.innerText = currentLang === 'uk' ? "Помилка відправки. Спробуйте ще раз." : "Error. Please try again.";
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
        }
    };
}

window.openBio = (id) => {
    const f = cache.founders.find(x => x.id === id);
    if (!f) return;
    const m = document.getElementById('bioModal');
    const data = document.getElementById('modal-data');
    data.innerHTML = `
        <div class="bio-flex">
            <img src="${f.img}" class="bio-img">
            <div>
                <h2 style="color:var(--primary);">${f.name[currentLang]}</h2>
                <p style="color:var(--accent);font-weight:700;margin-bottom:15px;">${f.role[currentLang]}</p>
                <div style="line-height:1.7;">${f.bio[currentLang]}</div>
                <div style="margin-top:20px; border-top:1px solid #eee; padding-top:10px;">
                    <p><b>Telegram:</b> ${f.tg}</p>
                    <p><b>Тел:</b> ${f.phone}</p>
                </div>
            </div>
        </div>`;
    m.style.display = 'block';
    document.body.style.overflow = 'hidden';
};

window.openFullImage = (src) => {
    const m = document.getElementById('bioModal');
    const data = document.getElementById('modal-data');
    data.innerHTML = `
        <div style="text-align:center;">
            <img src="${src}" style="max-width:100%; max-height:85vh; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.5);">
        </div>`;
    m.style.display = 'block';
    document.body.style.overflow = 'hidden';
};

const closeModal = () => {
    const m = document.getElementById('bioModal');
    if (m) {
        m.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

document.querySelector('.close-modal').onclick = closeModal;

window.onclick = (e) => {
    const m = document.getElementById('bioModal');
    if (e.target === m) closeModal();
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

document.querySelectorAll('.lang-btn').forEach(b => {
    b.onclick = (e) => {
        currentLang = e.target.dataset.lang;
        document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        refresh();
    };
});

document.addEventListener('DOMContentLoaded', init);