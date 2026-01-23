<script>
// 1. PANIC DEBUGGER
window.onerror = function(m, u, l) { alert("Engine Halt: " + m + " at line " + l); return false; };

// 2. V170 MASTER DATA POOL (Note: Name matches your screenshots)
const MASTER_POOL = [
    {
        "id": "MSTR_001",
        "rank": "E",
        "domain": "PHYSICAL",
        "goal": "Thermodynamic Work Definitions",
        "question": "In a reversible isothermal expansion of an ideal gas, what is the formula for the work done by the system?",
        "opt_up": "<i>w</i> = -<i>nRT</i> ln(<i>V</i><sub>2</sub>/<i>V</i><sub>1</sub>)",
        "opt_right": "<i>w</i> = -<i>P</i>Δ<i>V</i>",
        "opt_left": "<i>w</i> = Δ<i>U</i>",
        "correct": "UP",
        "expl_up": "Recall the integral of P dV when external and internal pressures are balanced."
    }
    /* PASTE REMAINING 101 QUESTIONS BELOW THIS LINE */
    /* ENSURE NO STRAY TEXT LIKE "SAMPLE ITEMS" AT THE END */
];

// 3. CORE ENGINE LOGIC
let currentIndex = 0;
const dock = document.getElementById('card-dock');

function renderCard(index) {
    if (!dock) return;
    if (index >= MASTER_POOL.length) {
        dock.innerHTML = "<div class='card'><div class='content'>Mastery Complete.</div></div>";
        return;
    }

    const data = MASTER_POOL[index];
    const card = document.createElement('div');
    card.className = 'card' + (data.rank === 'A' ? ' rank-a-pulse' : '');
    
    // UI Construction using your data keys: 'question' and 'id'
    let html = '<div class="content">' + data.question + '</div>';
    html += '<div class="meta">RANK ' + data.rank + ' | ID: ' + data.id + '</div>';
    card.innerHTML = html;

    let startX = 0, dist = 0;
    const threshold = (data.rank === 'A') ? 160 : 110;

    card.addEventListener('touchstart', function(e) {
        startX = e.touches[0].pageX;
    }, {passive: true});

    card.addEventListener('touchmove', function(e) {
        dist = e.touches[0].pageX - startX;
        card.style.transform = 'translateX(' + dist + 'px) rotate(' + (dist/15) + 'deg)';
    }, {passive: true});

    card.addEventListener('touchend', function() {
        if (Math.abs(dist) > threshold) {
            card.style.transition = '0.3s';
            card.style.transform = 'translateX(' + (dist > 0 ? 1000 : -1000) + 'px)';
            setTimeout(nextCard, 200);
        } else {
            card.style.transform = 'translateX(0) rotate(0)';
        }
    });

    dock.appendChild(card);
}

function nextCard() {
    currentIndex++;
    dock.innerHTML = '';
    renderCard(currentIndex);
    const masteryEl = document.getElementById('mastery');
    if(masteryEl) masteryEl.innerText = 'MASTERY: ' + Math.round((currentIndex/MASTER_POOL.length)*100) + '%';
}

// 4. BOOT SEQUENCE
window.onload = function() {
    if (typeof MASTER_POOL !== 'undefined' && MASTER_POOL.length > 0) {
        renderCard(0);
    } else {
        alert("CRITICAL: Data Pool is empty or undefined.");
    }
};
</script>
