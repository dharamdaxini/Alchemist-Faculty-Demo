/* script.js - V170 ASYNC SAFE ENGINE */
window.onerror = function(m, u, l) { console.error("Halt: " + m); return false; };

let currentIndex = 0;

// THE WAITER: This solves the time gap between data and script updates
function bootEngine() {
    const dock = document.getElementById('card-dock');
    
    // Check if data.js has finished loading/propagating
    if (typeof MASTER_POOL === 'undefined') {
        if (dock) dock.innerHTML = "<div style='color:#4a90e2; padding:40px;'>Syncing Master Data...</div>";
        setTimeout(bootEngine, 200); // Try again in 200ms
        return;
    }

    console.log("Data Link Established. Initializing V170.");
    renderCard(0);
}

function renderCard(index) {
    const dock = document.getElementById('card-dock');
    if (!dock || index >= MASTER_POOL.length) return;

    const data = MASTER_POOL[index];
    const card = document.createElement('div');
    card.className = 'card' + (data.rank === 'A' ? ' rank-a-pulse' : '');
    
    // Using 'question' key from your data.js
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

// Start the check loop on load
window.onload = bootEngine;
