export async function loadTranslations() {
    const res = await fetch('data/ui.json');
    return await res.json();
}

export function translatePage(data, lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const keys = key.split('.');
        let translation = data;
        keys.forEach(k => { translation = translation ? translation[k] : null; });
        if (translation && translation[lang]) el.textContent = translation[lang];
    });
}