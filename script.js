/* ALCHEMIST V170: ENGINE LOGIC */

// 1. PANIC DEBUGGER: Catches crashes in Acode/Mobile browsers
window.onerror = function(m, u, l) {
    alert("CRITICAL HALT: " + m + "\nLine: " + l);
    return false;
};

let currentIndex = 0;

function renderCard(index) {
    const dock = document.getElementById('card-dock');
    if (!dock) return;

    // Safety check for the 'undefined' error found in your console
    if (typeof MASTER_POOL === 'undefined') {
        dock.innerHTML = "<div style='color:#ff4b2b; padding:40px; text-align:center;'>DATA LINK FAILURE: MASTER_POOL is undefined.</div>";
        return;
    }

    if (index >= MASTER_POOL.length) {
        dock.innerHTML = "<div class='card'><div class='content'>Mastery Complete. 102/102 questions analyzed.</div></div>";
        return;
    }

    const data = MASTER_POOL[index];
    const card = document.createElement('div');
    
    // UI Logic: Signals Rank A cards with a pulse
    card.className = 'card' + (data.rank === 'A' ? ' rank-a-pulse' : '');
    
    // Key Mapping: question, id, rank
    card.innerHTML = '<div class="content">' + data.question + '</div>' +
                     '<div class="meta"><span>ID: ' + data.id + '</span><span>RANK ' + data.rank + '</span></div>';

    setupSwipe(card, data.rank);
    dock.appendChild(card);
}

function setupSwipe(card, rank) {
    let startX = 0, dist = 0;
    const threshold = (rank === 'A') ? 160 : 110; // "Hard Stretch" logic

    card.addEventListener('touchstart', e => { startX = e.touches[0].pageX; }, {passive: true});
    card.addEventListener('touchmove', e => {
        dist = e.touches[0].pageX - startX;
        card.style.transform = 'translateX(' + dist + 'px) rotate(' + (dist/15) + 'deg)';
    }, {passive: true});

    card.addEventListener('touchend', () => {
        if (Math.abs(dist) > threshold) {
            card.style.transition = '0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            card.style.transform = 'translateX(' + (dist > 0 ? 1000 : -1000) + 'px)';
            setTimeout(nextCard, 250);
        } else {
            card.style.transform = 'translateX(0) rotate(0)';
        }
    });
}

function nextCard() {
    currentIndex++;
    const dock = document.getElementById('card-dock');
    if (dock) dock.innerHTML = ''; 
    renderCard(currentIndex);
    
    const mastery = document.getElementById('mastery');
    if (mastery) mastery.innerText = 'MASTERY: ' + Math.round((currentIndex / MASTER_POOL.length) * 100) + '%';
}

// Start rendering once the bootloader finishes
window.onload = () => { renderCard(0); };
