export function renderActivities(data, lang) {
    const container = document.getElementById('activities-container');
    if (!container || !data) return;

    container.innerHTML = data.map(item => `
        <div class="b2-item-card">
            <div class="b2-card-inner">
                <!-- Лицьова сторона -->
                <div class="b2-card-front">
                    <div class="b2-icon-box">
                        <i class="fa-solid fa-${item.icon}"></i>
                    </div>
                    <h4>${item.title[lang]}</h4>
                    <div class="b2-flip-hint">
                        <i class="fa-solid fa-rotate"></i>
                    </div>
                </div>
                <!-- Зворотна сторона -->
                <div class="b2-card-back">
                    <p>${item.desc[lang]}</p>
                </div>
            </div>
        </div>
    `).join('');
}