/**
 * ALCHEMIST V170: ENGINE LOGIC
 * Architecture: Mobile-Optimized Physics Engine
 * Logic: 3-Way Swipe + "Hard Stretch" commitment mechanics.
 */

// 1. PANIC DEBUGGER: Prevents silent failure in mobile environments
window.onerror = function(message, source, lineno, colno, error) {
    const errorMsg = "CRITICAL ENGINE HALT\n" + 
                     "--------------------\n" +
                     "Error: " + message + "\n" +
                     "Line: " + lineno + "\n" +
                     "File: " + (source ? source.split('/').pop() : 'inline');
    alert(errorMsg); // Forces visibility on mobile devices
    return false;
};

let currentIndex = 0;
const dock = document.getElementById('card-dock');

/**
 * CORE RENDERING ENGINE
 * Maps dataset keys 'question', 'id', and 'rank' to the DOM.
 */
function renderCard(index) {
    if (!dock) return;
    
    // Safety check for 'undefined' error caught in forensic audit
    if (typeof MASTER_POOL === 'undefined') {
        dock.innerHTML = `
            <div style="padding:40px; color:#ff4b2b; text-align:center;">
                <h3>DATA LINK FAILURE</h3>
                <p>MASTER_POOL is undefined. Ensure data.js is loaded BEFORE script.js.</p>
            </div>`;
        return;
    }

    if (index >= MASTER_POOL.length) {
        dock.innerHTML = `
            <div class="card" style="border-color:var(--accent);">
                <div class="content">
                    <h2>Mastery Complete</h2>
                    <p>All ${MASTER_POOL.length} physical principles analyzed.</p>
                </div>
            </div>`;
        return;
    }

    const data = MASTER_POOL[index];
    const card = document.createElement('div');
    
    // Logic: Physically signal Rank A questions with the pulse animation
    card.className = 'card' + (data.rank === 'A' ? ' rank-a-pulse' : '');
    
    // UI Assembly using standard concatenation for mobile WebView stability
    let html = '<div class="content">' + data.question + '</div>';
    html += '<div class="meta"><span>ID: ' + data.id + '</span><span>RANK ' + data.rank + '</span></div>';
    card.innerHTML = html;

    // Initialize Physics Logic for this specific card
    setupCardPhysics(card, data.rank);
    
    dock.appendChild(card);
}

/**
 * PHYSICS LOGIC: Swipe Mechanics & "Hard Stretch" Logic
 * 160px for Rank A | 110px for Standard Ranks
 */
function setupCardPhysics(card, rank) {
    let startX = 0, dist = 0;
    const threshold = (rank === 'A') ? 160 : 110;

    card.addEventListener('touchstart', function(e) {
        startX = e.touches[0].pageX;
        card.style.transition = 'none'; // Instant response during drag
    }, {passive: true});

    card.addEventListener('touchmove', function(e) {
        dist = e.touches[0].pageX - startX;
        const rotation = dist / 15;
        card.style.transform = 'translateX(' + dist + 'px) rotate(' + rotation + 'deg)';
    }, {passive: true});

    card.addEventListener('touchend', function() {
        if (Math.abs(dist) > threshold) {
            // Swipe Commitment
            card.style.transition = '0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            card.style.transform = 'translateX(' + (dist > 0 ? 1200 : -1200) + 'px) rotate(' + (dist / 5) + 'deg)';
            setTimeout(nextCard, 250);
        } else {
            // Spring Back
            card.style.transition = '0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.transform = 'translateX(0) rotate(0)';
        }
    });
}

function nextCard() {
    currentIndex++;
    dock.innerHTML = ''; // Clear previous card
    renderCard(currentIndex);
    
    // Update Progress UI
    const masteryEl = document.getElementById('mastery');
    if (masteryEl && MASTER_POOL.length > 0) {
        const progress = Math.round((currentIndex / MASTER_POOL.length) * 100);
        masteryEl.innerText = 'MASTERY: ' + progress + '%';
    }
}

// BOOT SEQUENCE: Ensures the DOM is ready before starting the engine
window.onload = function() {
    renderCard(0);
};
