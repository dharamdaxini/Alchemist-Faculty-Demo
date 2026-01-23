/* ALCHEMIST V171: ENGINE LOGIC */

// 1. PANIC DEBUGGER: Captures crashes in mobile browsers
window.onerror = function(m, u, l) {
    alert("CRITICAL HALT: " + m + "\nLine: " + l);
    return false;
};

let currentIndex = 0;

function renderCard(index) {
    const dock = document.getElementById('card-dock');
    if (!dock) return;

    // Safety check for the 'undefined' data error
    if (typeof MASTER_POOL === 'undefined') {
        dock.innerHTML = "<div style='color:#ff4b2b; padding:40px; text-align:center;'>DATA LINK FAILURE: Check MASTER_POOL in data.js.</div>";
        return;
    }

    if (index >= MASTER_POOL.length) {
        dock.innerHTML = "<div class='card'><div class='content'>Mastery Complete. 102 Items Analyzed.</div></div>";
        return;
    }

    const data = MASTER_POOL[index];
    const card = document.createElement('div');
    
    // UI Logic: Signals Rank A cards with the pulse animation
    card.className = 'card' + (data.rank === 'A' ? ' rank-a-pulse' : '');
    
    // Mapping keys: question, id, rank
    card.innerHTML = '<div class="content">' + data.question + '</div>' +
                     '<div class="meta"><span>ID: ' + data.id + '</span><span>RANK ' + data.rank + '</span></div>';

    setupSwipe(card, data.rank);
    dock.appendChild(card);
}

function setupSwipe(card, rank) {
    let startX = 0, dist = 0;
    const threshold = (rank === 'A') ? 160 : 110;

    card.addEventListener('touchstart', e => { 
        startX = e.touches[0].pageX; 
        card.style.transition = 'none';
    }, {passive: true});

    card.addEventListener('touchmove', e => {
        dist = e.touches[0].pageX - startX;
        card.style.transform = 'translateX(' + dist + 'px) rotate(' + (dist/15) + 'deg)';
    }, {passive: true});

    card.addEventListener('touchend', () => {
        if (Math.abs(dist) > threshold) {
            card.style.transition = '0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            card.style.transform = 'translateX(' + (dist > 0 ? 1200 : -1200) + 'px)';
            setTimeout(nextCard, 200);
        } else {
            card.style.transition = '0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
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

// Initial Boot Sequence
window.onload = () => { renderCard(0); };
