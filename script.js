/* script.js */

// 1. PANIC DEBUGGER
window.onerror = function(m, u, l) {
    alert("FATAL ERROR: " + m + "\nLine: " + l);
    return false;
};

let currentIndex = 0;

function renderCard(index) {
    const dock = document.getElementById('card-dock');
    if (!dock) return;

    // Fix for the 'undefined' error
    if (typeof MASTER_POOL === 'undefined') {
        dock.innerHTML = `
            <div style="padding:40px; color:#ff4b2b; text-align:center; font-family:sans-serif;">
                <h2 style="letter-spacing:1px;">DATA LINK FAILURE</h2>
                <p>MASTER_POOL is undefined.<br>Ensure data.js is loaded BEFORE script.js.</p>
            </div>`;
        return;
    }

    if (index >= MASTER_POOL.length) {
        dock.innerHTML = "<div class='card'><div class='content'>Mastery Complete.</div></div>";
        return;
    }

    const data = MASTER_POOL[index];
    const card = document.createElement('div');
    card.className = 'card' + (data.rank === 'A' ? ' rank-a-pulse' : '');
    
    // Mapping keys from your dataset
    card.innerHTML = '<div class="content">' + data.question + '</div>' +
                     '<div class="meta"><span>ID: ' + data.id + '</span><span>RANK ' + data.rank + '</span></div>';

    setupSwipe(card, data.rank);
    dock.appendChild(card);
}

function setupSwipe(card, rank) {
    let startX = 0, dist = 0;
    const threshold = (rank === 'A') ? 160 : 110;

    card.addEventListener('touchstart', e => { startX = e.touches[0].pageX; }, {passive: true});
    card.addEventListener('touchmove', e => {
        dist = e.touches[0].pageX - startX;
        card.style.transform = 'translateX(' + dist + 'px) rotate(' + (dist/15) + 'deg)';
    }, {passive: true});

    card.addEventListener('touchend', () => {
        if (Math.abs(dist) > threshold) {
            card.style.transition = '0.3s';
            card.style.transform = 'translateX(' + (dist > 0 ? 1000 : -1000) + 'px)';
            setTimeout(nextCard, 200);
        } else {
            card.style.transform = 'translateX(0) rotate(0)';
        }
    });
}

function nextCard() {
    currentIndex++;
    document.getElementById('card-dock').innerHTML = '';
    renderCard(currentIndex);
    document.getElementById('mastery').innerText = 'MASTERY: ' + Math.round((currentIndex/MASTER_POOL.length)*100) + '%';
}

window.onload = () => { renderCard(0); };
