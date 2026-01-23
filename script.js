/* ALCHEMIST V170: ENGINE LOGIC */

// 1. PANIC DEBUGGER: Alerts exact line of failure on mobile
window.onerror = function(m, u, l) { 
    alert("Engine Halt: " + m + "\nLine: " + l); 
    return false; 
};

let currentIndex = 0;
const dock = document.getElementById('card-dock');

function renderCard(index) {
    if (!dock) return;
    
    // Check if data loaded correctly
    if (typeof MASTER_POOL === 'undefined') {
        alert("CRITICAL: MASTER_POOL data not found. Check data.js link.");
        return;
    }

    if (index >= MASTER_POOL.length) {
        dock.innerHTML = "<div class='card'><div class='content'>Mastery Complete. 102/102 questions analyzed.</div></div>";
        return;
    }

    const data = MASTER_POOL[index];
    const card = document.createElement('div');
    
    // Logic: Apply Rank A Pulse if applicable
    card.className = 'card' + (data.rank === 'A' ? ' rank-a-pulse' : '');
    
    // UI Injection using your dataset keys
    let html = '<div class="content">' + data.question + '</div>';
    html += '<div class="meta"><span>ID: ' + data.id + '</span><span>RANK ' + data.rank + '</span></div>';
    card.innerHTML = html;

    // Interaction State
    let startX = 0, dist = 0;
    const threshold = (data.rank === 'A') ? 160 : 110; // "Hard Stretch" logic

    card.addEventListener('touchstart', function(e) {
        startX = e.touches[0].pageX;
    }, {passive: true});

    card.addEventListener('touchmove', function(e) {
        dist = e.touches[0].pageX - startX;
        const rot = dist / 15;
        card.style.transform = 'translateX(' + dist + 'px) rotate(' + rot + 'deg)';
    }, {passive: true});

    card.addEventListener('touchend', function() {
        if (Math.abs(dist) > threshold) {
            // Commit swipe
            card.style.transition = '0.3s';
            card.style.transform = 'translateX(' + (dist > 0 ? 1000 : -1000) + 'px)';
            setTimeout(nextCard, 200);
        } else {
            // Spring back
            card.style.transform = 'translateX(0) rotate(0)';
        }
    });

    dock.appendChild(card);
}

function nextCard() {
    currentIndex++;
    dock.innerHTML = '';
    renderCard(currentIndex);
    
    // Update Mastery UI
    const masteryEl = document.getElementById('mastery');
    if(masteryEl) {
        masteryEl.innerText = 'MASTERY: ' + Math.round((currentIndex / MASTER_POOL.length) * 100) + '%';
    }
}

// BOOT SEQUENCE
window.onload = function() {
    renderCard(0);
};
