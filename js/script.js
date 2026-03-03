// 1. Ссылка на твой RAW JSON
const DATA_URL = 'https://raw.githubusercontent.com/superyogurt118/Amyoba/refs/heads/main/data.json'; 

// 2. Правила произношения
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

// 4. Темы
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
    if (!DATA_URL) return;
    try {
        const response = await fetch(DATA_URL);
        const data = await response.json();
        
        // Буквы с иконкой звука
        const grid = document.getElementById('alpha-grid');
        grid.innerHTML = data.alphabet.map(l => {
            let char = l.split(' ')[0];
            let sound = PHONETICS[char] || PHONETICS[char.toUpperCase()] || char;
            return `
                <div class="card">
                    <div>${l}</div>
                    <button class="speak-btn" onclick="speak('${sound}')">🔊</button>
                </div>`;
        }).join('');

        // Слова с иконкой звука
        document.getElementById('vocab-list').innerHTML = data.dictionary.map(v => `
            <div class="list-item">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span><b>${v.word}</b> — ${v.translation}</span>
                    <button class="speak-btn" onclick="speak('${v.word}')">🔊</button>
                </div>
            </div>`).join('');
            
    } catch (e) { console.error("Ошибка:", e); }
}

function showSection(id) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

window.onload = load;
