// 1. Ссылка на твой RAW JSON (обязательно вставь свою!)
const DATA_URL = 'https://raw.githubusercontent.com/superyogurt118/Amyoba/refs/heads/main/data.json'; 

// 2. Твои правила произношения (фонетика)
const PHONETICS = {
    'Ӵ': 'ч', 'Ӝ': 'жь', 'Ӟ': 'зь', 'Ч': 'тш', 'ӥ': 'йи', 'ӧ': 'оу', 'Ѣ': 'ых'
};

// 3. Функция озвучки
function speak(text) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'ru-RU';
    msg.rate = 0.8; 
    window.speechSynthesis.speak(msg);
}

// 4. Темы (Авто, Светлая, Тёмная)
let themeIdx = 0;
const themes = ['auto', 'light', 'dark'];

function cycleTheme() {
    themeIdx = (themeIdx + 1) % 3;
    const current = themes[themeIdx];
    const btn = document.getElementById('theme-btn');
    if (current === 'auto') {
        const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.setAttribute('data-theme', dark ? 'dark' : 'light');
        btn.innerText = "Тема: Авто";
    } else {
        document.body.setAttribute('data-theme', current);
        btn.innerText = current === 'dark' ? "Тема: Тёмная" : "Тема: Светлая";
    }
}

// 5. Загрузка данных
async function load() {
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.setAttribute('data-theme', dark ? 'dark' : 'light');
    if (!DATA_URL) return;
    try {
        const response = await fetch(DATA_URL);
        const data = await response.json();
        const grid = document.getElementById('alpha-grid');
        grid.innerHTML = data.alphabet.map(l => {
            let char = l.split(' ')[0];
            return `<div class="card" onmousedown="press('${char}')" onmouseup="stop()" ontouchstart="press('${char}')" ontouchend="stop()">${l}</div>`;
        }).join('');
        document.getElementById('gram-list').innerHTML = data.grammar.map(g => `<div class="list-item"><h3>${g.title}</h3><p>${g.text}</p></div>`).join('');
        document.getElementById('vocab-list').innerHTML = data.dictionary.map(v => `<div class="list-item"><b>${v.word}</b> — ${v.translation}</div>`).join('');
    } catch (e) { console.error("Ошибка:", e); }
}

function press(c) {
    const bubble = document.getElementById('speech-bubble');
    const sound = PHONETICS[c] || PHONETICS[c.toUpperCase()] || PHONETICS[c.toLowerCase()] || c;
    bubble.innerText = PHONETICS[c] ? `Читается как [${sound}]` : `Буква ${c}`;
    bubble.style.display = 'block';
    speak(sound);
}

function stop() { document.getElementById('speech-bubble').style.display = 'none'; }
function showSection(id) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

window.onload = load;
