const CONFIG = {
    dataUrl: 'https://raw.githubusercontent.com/superyogurt118/Amyoba/refs/heads/main/data.json', // <-- ВСТАВЬ СВОЮ ССЫЛКУ RAW JSON СЮДА
    logoPath: 'logo.png' 
};

const PHONETICS = {
    'Ӵ': 'ч', 'Ӝ': 'жь', 'Ӟ': 'зь', 'Ч': 'тш', 'ӥ': 'йи', 'ӧ': 'оу', 'Ѣ': 'ых'
};

function press(char) {
    const bubble = document.getElementById('speech-bubble');
    const sound = PHONETICS[char] || PHONETICS[char.toUpperCase()] || char;
    bubble.innerText = PHONETICS[char] ? `Читается как [${sound}]` : `Буква ${char}`;
    bubble.style.display = 'block';
}

function stop() {
    document.getElementById('speech-bubble').style.display = 'none';
}

function cycleTheme() {
    const body = document.body;
    const current = body.getAttribute('data-theme');
    body.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
}

function showSection(id) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

async function load() {
    document.getElementById('main-logo').src = CONFIG.logoPath;
    const loader = document.getElementById('loader');
    const content = document.getElementById('main-content');
    
    if (!CONFIG.dataUrl) return;

    try {
        const r = await fetch(CONFIG.dataUrl);
        const d = await r.json();
        
        document.getElementById('alpha-grid').innerHTML = d.alphabet.map(l => {
            let char = l.split(' ')[0];
            return `<div class="card" 
                onmousedown="press('${char}')" onmouseup="stop()" 
                ontouchstart="press('${char}')" ontouchend="stop()">${l}</div>`;
        }).join('');

        document.getElementById('vocab-list').innerHTML = d.dictionary.map(v => `
            <div class="list-item"><b>${v.word}</b> — ${v.translation}</div>`).join('');

        loader.classList.add('hidden');
        content.classList.remove('hidden');
    } catch (e) { 
        loader.innerHTML = "<p>Ошибка загрузки данных. Проверьте ссылку.</p>"; 
    }
}

window.onload = load;
