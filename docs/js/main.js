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
    setupBackToTop();
    setupScrollEffects();

    cache.founders = await getJSON('data/founders.json') || [];
    cache.stats = await getJSON('data/stats.json') || [];
    cache.partners = await getJSON('data/partners.json') || [];
    cache.news = await getJSON('data/news.json') || [];
    cache.stories = await getJSON('data/stories.json') || [];
    cache.contacts = await getJSON('data/contacts.json') || {};
    cache.activities = await getJSON('data/activities.json') || [];

    refresh();
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
        'https://via.placeholder.com/400x300?text=Event+1',
        'https://via.placeholder.com/400x300?text=Event+2',
        'https://via.placeholder.com/400x300?text=Event+3'
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

// Анімація появи, підсвітка меню ТА підсвітка заголовків
function setupScrollEffects() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const reveals = document.querySelectorAll('.reveal');

    window.addEventListener('scroll', () => {
        let current = "";
        const scrollPos = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

        // 1. Reveal effects + Заголовки
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const windowHeight = window.innerHeight;
            
            // Якщо секція в центрі екрану
            if (scrollPos >= sectionTop - 250 && scrollPos < sectionTop + sectionHeight - 250) {
                current = section.getAttribute("id");
                
                // Знаходимо заголовок всередині цієї секції і додаємо клас підсвітки
                const title = section.querySelector('.section-title');
                if (title) title.classList.add('highlight');
            } else {
                // Прибираємо підсвітку, якщо вийшли з секції
                const title = section.querySelector('.section-title');
                if (title) title.classList.remove('highlight');
            }

            // Класична анімація появи (Reveal)
            if (section.classList.contains('reveal')) {
                if (section.getBoundingClientRect().top < windowHeight - 150) {
                    section.classList.add('active');
                }
            }
        });

        // 2. Navigation Active State (Меню в хедері)
        navLinks.forEach((a) => {
            a.classList.remove("active");
            if (a.getAttribute("href").includes(current) && current !== "") {
                a.classList.add("active");
            }
        });
    });
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
        const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollPos > 300) {
            btn.setAttribute("style", "display: flex !important");
        } else {
            btn.setAttribute("style", "display: none !important");
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
    data.innerHTML = `<div class="bio-flex">
            <img src="${f.img}" class="bio-img">
            <div>
                <h2 style="color:var(--primary);">${f.name[currentLang]}</h2>
                <p style="color:var(--accent);font-weight:700;margin-bottom:15px;">${f.role[currentLang]}</p>
                <div style="line-height:1.7;">${f.bio[currentLang]}</div>
                <p style="margin-top:20px;"><b>TG:</b> ${f.tg} | <b>Тел:</b> ${f.phone}</p>
            </div>
        </div>`;
    m.style.display = 'block';
    document.body.style.overflow = 'hidden';
};

window.openFullImage = (src) => {
    const m = document.getElementById('bioModal');
    const data = document.getElementById('modal-data');
    data.innerHTML = `<div style="text-align:center;"><img src="${src}" style="max-width:100%; max-height:85vh; border-radius:15px;"></div>`;
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
window.onclick = (e) => { if (e.target === document.getElementById('bioModal')) closeModal(); };
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

document.querySelectorAll('.lang-btn').forEach(b => {
    b.onclick = (e) => {
        currentLang = e.currentTarget.dataset.lang;
        document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
        e.currentTarget.classList.add('active');
        refresh();
    };
});

document.addEventListener('DOMContentLoaded', init);