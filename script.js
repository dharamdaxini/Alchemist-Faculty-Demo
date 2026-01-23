/* script.js */
window.onerror = function(m, u, l) { alert("Engine Halt: " + m + " at line " + l); return false; };

let currentIndex = 0;

function renderCard(index) {
    const dock = document.getElementById('card-dock');
    if (!dock) return;

    // Fix for the 'undefined' error caught in your console
    if (typeof MASTER_POOL === 'undefined') {
        dock.innerHTML = "<div style='color:#ff4b2b; padding:40px; text-align:center;'>DATA LINK FAILURE: MASTER_POOL is undefined.</div>";
        return;
    }

    if (index >= MASTER_POOL.length) {
        dock.innerHTML = "<div class='card'><div class='content'>Mastery Complete.</div></div>";
        return;
    }

    const data = MASTER_POOL[index];
    const card = document.createElement('div');
    card.className = 'card' + (data.rank === 'A' ? ' rank-a-pulse' : '');
    
    // Mapping keys exactly as they appear in your data.js
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
    const dock = document.getElementById('card-dock');
    if (dock) dock.innerHTML = '';
    renderCard(currentIndex);
    const mastery = document.getElementById('mastery');
    if (mastery) mastery.innerText = 'MASTERY: ' + Math.round((currentIndex / MASTER_POOL.length) * 100) + '%';
}

window.onload = () => { renderCard(0); };
