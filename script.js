// --- SYSTEM CONFIG ---
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbyUrjUy8jL3jrJ8k3yIjEdFbFHtoyfbR7PRXAjnUzbopTOELvGT-MQXw7pApmOeahuyoA/exec";
const SESSION_ID = "SESS_" + Date.now().toString().slice(-5);
let db, INDEX = 0, SCORE = 0, POOL = [];
const DB_NAME = "AlchemistDB_V159", STORE_NAME = "Vaults";

// --- CORE PHYSICS ENGINE ---
function bindPhysics(el, data) {
    let startX, startY, isDragging = false;
    
    // PIVOT CALCULATION: Exact center of the Yellow Line
    // Syncs with CSS bottom: 220px
    const pivotY = window.innerHeight - 220; 
    const pivotX = window.innerWidth / 2;

    // Element References
    const qText = el.querySelector('#q-text');
    const ovText = el.querySelector('#ov-text');
    const dock = document.querySelector('#card-dock');
    const colLeft = document.querySelector('#col-left');
    const colRight = document.querySelector('#col-right');
    const colUp = document.querySelector('#col-up');

    el.addEventListener('touchstart', e => { 
        isDragging = true; 
        startX = e.touches[0].clientX; 
        startY = e.touches[0].clientY; 
        el.style.transition = 'none'; 
    });
    
    window.addEventListener('touchmove', e => {
        if (!isDragging) return;
        const cx = e.touches[0].clientX; 
        const cy = e.touches[0].clientY;
        
        const dragX = cx - startX;
        const dragY = cy - startY;
        const dist = Math.sqrt(dragX * dragX + dragY * dragY);

        // Replacement logic for the <script> section
let POOL = [];
let INDEX = 0, SCORE = 0;

async function initializeEngine() {
    try {
        const response = await fetch('chemistry_master.json');
        if (!response.ok) throw new Error('Network response was not ok');
        POOL = await response.json();
        
        // Safety check for empty data
        if (POOL.length > 0) {
            renderCard();
        } else {
            document.getElementById('stage').innerHTML = "Error: Dataset is empty.";
        }
    } catch (error) {
        console.error("Failed to load chemistry curriculum:", error);
        document.getElementById('stage').innerHTML = "Initialization Error: chemistry_master.json not found.";
    }
}

// Update renderCard() to include the Rank A "Hard Stretch" logic check
function renderCard() {
    if (INDEX >= POOL.length) { renderEnd(); return; }
    const data = POOL[INDEX];
    
    // UI Metadata updates
    document.getElementById('domain-label').innerText = `${data.domain} | ${data.id}`;
    document.getElementById('val-u').innerHTML = data.opt_up;
    document.getElementById('val-r').innerHTML = data.opt_right;
    document.getElementById('val-l').innerHTML = data.opt_left;

    const card = document.createElement('div');
    card.className = "card";
    
    // Expert Signal Check for Rank A
    const rankClass = data.rank === 'A' ? 'rank-tag rank-a-glow' : 'rank-tag';
    card.innerHTML = `
        <div class="${rankClass}">RANK ${data.rank}</div>
        <div class="card-top">
            <div class="goal-header">${data.goal}</div>
            <div class="card-q" id="q-text">${data.question}</div>
            <div class="card-overlay-text" id="ov-text"></div>
        </div>`;
    
    document.getElementById('stage').appendChild(card);
    bindPhysics(card, data);
}

// Call initializer instead of renderCard directly
initializeEngine();


        // 1. DEAD ZONE LOGIC (Below Yellow Line)
        if (cy > pivotY) {
            // Loose feedback: card detaches and slides slightly
            el.style.transform = `translateX(calc(-50% + ${dragX * 0.1}px)) translateY(${dragY * 0.3}px)`;
            
            // UI Reset
            qText.style.opacity = 1; 
            ovText.style.opacity = 0;
            [colLeft, colRight, colUp].forEach(c => c.classList.remove('active'));
            
            // Analysis Trigger (Deep Drag Down)
            if(dragY > 100) {
                qText.style.opacity = 0; 
                ovText.style.opacity = 1; 
                ovText.innerText = "ANALYSIS"; 
                ovText.style.color = "var(--gold)";
                dock.classList.add('analysis-mode');
            } else {
                dock.classList.remove('analysis-mode');
            }
            return;
        }

        // 2. ACTIVE ZONE LOGIC (Above Yellow Line)
        dock.classList.remove('analysis-mode');
        ovText.style.color = "#fff";

        // VECTOR CALCULATION (Pendulum Math)
        const dx = cx - pivotX;
        const dy = cy - pivotY; // dy is negative
        let angleDeg = Math.atan2(dx, -dy) * (180 / Math.PI);
        
        // STRICT V-CONE CLAMP (±7.5°)
        let rot = angleDeg;
        if (rot > 7.5) rot = 7.5; 
        if (rot < -7.5) rot = -7.5;

        // PINNED ROTATION: No translation allowed here
        el.style.transform = `translateX(-50%) rotate(${rot}deg)`;
        
        // 3. SAFETY CIRCLE (Noise Filter - 0.5cm / 40px)
        const NOISE_RADIUS = 40;
        if (dist < NOISE_RADIUS) {
            qText.style.opacity = 1; 
            ovText.style.opacity = 0;
            [colLeft, colRight, colUp].forEach(c => c.classList.remove('active'));
            return; 
        }

        // 4. CROSS-FADE PROGRESSION
        const activeDist = dist - NOISE_RADIUS;
        const progress = Math.min(activeDist / 120, 1);
        
        qText.style.opacity = 1 - progress; 
        ovText.style.opacity = progress;
        
        // 5. ZONE HIGHLIGHTING
        [colLeft, colRight, colUp].forEach(c => c.classList.remove('active'));

        // Up: Within +/- 15 deg vector
        if (dragY < -40 && Math.abs(angleDeg) < 15) {
            ovText.innerHTML = formatText(data.u_txt); 
            if(progress > 0.1) colUp.classList.add('active');
        } else if (dragX > 40) {
            ovText.innerHTML = formatText(data.r_txt); 
            if(progress > 0.1) colRight.classList.add('active');
        } else if (dragX < -40) {
            ovText.innerHTML = formatText(data.l_txt); 
            if(progress > 0.1) colLeft.classList.add('active');
        }
    });

    window.addEventListener('touchend', e => {
        if (!isDragging) return; 
        isDragging = false;
        
        const currentY = e.changedTouches[0].clientY;
        const dragY = currentY - startY;

        // RELEASE IN DEAD ZONE
        if (currentY > pivotY) { 
            if (dragY > 100) finishSwipe(el, data, "DOWN"); 
            else resetCard(el);
            return; 
        }

        const dragX = e.changedTouches[0].clientX - startX;
        const totalDist = Math.sqrt(dragX * dragX + dragY * dragY);
        
        const dx = e.changedTouches[0].clientX - pivotX;
        const dy = currentY - pivotY;
        let angleDeg = Math.atan2(dx, -dy) * (180 / Math.PI);

        // COMMIT THRESHOLD (Hard Stretch > 150px)
        if (totalDist > 150) {
            if (dragY < -60 && Math.abs(angleDeg) < 20) finishSwipe(el, data, "UP");
            else if (dragX > 60) finishSwipe(el, data, "RIGHT");
            else if (dragX < -60) finishSwipe(el, data, "LEFT");
            else resetCard(el);
        } else {
            resetCard(el);
        }
    });
}

// --- TRANSITION HANDLERS ---
function resetCard(el) { 
    el.style.transition = 'transform 0.3s cubic-bezier(0.1, 0.9, 0.2, 1)'; 
    el.style.transform = 'translateX(-50%) rotate(0deg)'; 
    el.querySelector('#q-text').style.opacity = 1;
    el.querySelector('#ov-text').style.opacity = 0;
    document.querySelector('#card-dock').classList.remove('analysis-mode');
    document.querySelectorAll('.dock-col').forEach(c => c.classList.remove('active'));
}

function finishSwipe(el, data, dir) {
    if(dir === "DOWN") {
        el.style.transition = 'transform 0.4s ease-in';
        el.style.transform = `translateX(-50%) translateY(100vh)`;
        setTimeout(() => { showAnalysis(data.expl); el.remove(); INDEX++; renderCard(); }, 300);
        logData(data.id, "ANALYSIS", "VIEW", "");
        return;
    }

    let tx = dir === "RIGHT" ? window.innerWidth : (dir === "LEFT" ? -window.innerWidth : 0);
    let ty = dir === "UP" ? -window.innerHeight : 0;
    let rot = dir === "RIGHT" ? 7.5 : (dir === "LEFT" ? -7.5 : 0);
    
    el.style.transition = 'transform 0.25s ease-out'; 
    el.style.transform = `translateX(-50%) translate(${tx}px, ${ty}px) rotate(${rot}deg)`;

    const corr = (dir === data.actualAns); 
    SCORE += corr ? 1 : 0; 
    logData(data.id, dir, corr ? "CORRECT" : "WRONG", "");
    setTimeout(() => { el.remove(); INDEX++; renderCard(); }, 250);
}
