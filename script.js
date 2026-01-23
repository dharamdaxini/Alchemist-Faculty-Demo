/**
 * Alchemist v167.0 | Stable Master Logic
 * Integration: R1 Dataset (SET_A to SET_F)
 */

// 1. DATA POOL (Inject your 100-question TSV/JSON here)
const POOL = [
  {
    "id": "SET_A_001", "rank": "E", "domain": "ANALYTICAL", "goal": "LOD Definitions",
    "question": "In a calibration curve, what is the formal definition of the 'Blank' ($S_{blank}$)?",
    "opt_up": "Signal from a sample with no analyte", "opt_right": "Signal from lowest standard", "opt_left": "Mean of all standards",
    "correct": "UP", "expl_up": "Correct. The blank corrects for background and determines the noise floor.",
    "expl_right": "Incorrect. The lowest standard contains analyte; the blank specifically does not.",
    "expl_left": "Incorrect. This is the mean response, not the baseline.",
    "analysis": "<b>Physical Principle:</b> The <b>Analytical Blank</b> establishes the signal-to-noise floor for $LOD$ ($3\\sigma$) calculations.",
    "next_steps": "1. Calculate $\\sigma_{blank}$. 2. Define LOQ for the dataset."
  }
  // Add remaining master data here...
];

let INDEX = 0, SCORE = 0;

/**
 * Renders the Card and Dock content
 */
function renderCard() {
    if (INDEX >= POOL.length) { renderEnd(); return; }
    const data = POOL[INDEX];
    
    // Update Meta-UI
    document.getElementById('meta-label').innerText = data.domain + " | " + data.id;
    document.getElementById('val-u').innerHTML = data.opt_up;
    document.getElementById('val-r').innerHTML = data.opt_right;
    document.getElementById('val-l').innerHTML = data.opt_left;

    // Create Card Element
    const card = document.createElement('div');
    card.className = "card";
    
    // Stable String Concatenation (Prevents Mobile Rendering Bugs)
    var rankClass = (data.rank === 'A') ? "rank-tag rank-a-glow" : "rank-tag";
    card.innerHTML = '<div class="' + rankClass + '">RANK ' + data.rank + '</div>' +
                     '<div class="card-top">' +
                     '<div class="goal-header">' + data.goal + '</div>' +
                     '<div class="card-q" id="q-text">' + data.question + '</div>' +
                     '<div class="card-overlay-text" id="ov-text"></div>' +
                     '</div>';
    
    document.getElementById('stage').appendChild(card);
    bindPhysics(card, data);
}

/**
 * Handles the 3-Way Swipe Physics and Thresholds
 */
function bindPhysics(el, data) {
    var startX, startY, isDragging = false;
    var pivotY = window.innerHeight - 220, pivotX = window.innerWidth / 2;
    var qT = el.querySelector('#q-text'), ovT = el.querySelector('#ov-text');
    var cols = { UP: document.getElementById('col-up'), RIGHT: document.getElementById('col-right'), LEFT: document.getElementById('col-left') };

    el.addEventListener('touchstart', function(e) { 
        isDragging = true; startX = e.touches[0].clientX; startY = e.touches[0].clientY; el.style.transition = 'none';
    });

    window.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        var cx = e.touches[0].clientX, cy = e.touches[0].clientY;
        var dist = Math.sqrt(Math.pow(cx - startX, 2) + Math.pow(cy - startY, 2));
        var ang = Math.atan2(cx - pivotX, -(cy - pivotY)) * (180 / Math.PI);
        
        // Tilt Logic
        el.style.transform = 'rotate(' + Math.max(-8, Math.min(8, ang)) + 'deg)';
        
        // Overlay Fade Logic
        var prog = Math.min(Math.max(0, dist - 20) / 80, 1);
        qT.style.opacity = 1 - prog; ovT.style.opacity = prog;
        
        // Active Dock Highlighting
        Object.values(cols).forEach(function(c) { c.classList.remove('active'); });
        var sel = "UP"; if (ang < -15) sel = "LEFT"; else if (ang > 15) sel = "RIGHT";
        cols[sel].classList.add('active');
        
        // Dynamic Heuristic Display
        ovT.innerHTML = '<span style="font-size:0.8rem; color:var(--gold); display:block; margin-bottom:8px;">HEURISTIC</span>' + data['expl_' + sel.toLowerCase()];
    });

    window.addEventListener('touchend', function(e) {
        if (!isDragging) return; isDragging = false;
        var ex = e.changedTouches[0].clientX, ey = e.changedTouches[0].clientY;
        var total = Math.sqrt(Math.pow(ex - startX, 2) + Math.pow(ey - startY, 2));
        var ang = Math.atan2(ex - pivotX, -(ey - pivotY)) * (180 / Math.PI);
        
        // HARD STRETCH: Expert cards (Rank A) require 160px vs 110px
        var threshold = (data.rank === "A") ? 160 : 110;
        
        if (total > threshold) {
            var dir = "UP"; if (ang < -15) dir = "LEFT"; else if (ang > 15) dir = "RIGHT";
            finishSwipe(el, data, dir);
        } else { resetCard(el); }
    });
}

/**
 * Handles Animation Out and Score Tracking
 */
function finishSwipe(el, data, dir) {
    var isCorrect = (dir === data.correct);
    el.style.transition = 'transform 0.4s ease-in, opacity 0.4s';
    el.style.opacity = '0';
    el.style.transform = 'translate(' + (dir === "UP" ? 0 : (dir === "LEFT" ? -500 : 500)) + 'px, ' + (dir === "UP" ? -500 : 0) + 'px)';
    
    if(isCorrect) SCORE++;
    document.getElementById('score-disp').innerText = "MASTERY: " + Math.round((SCORE/(INDEX+1))*100) + "%";
    document.getElementById('progress').style.width = ((INDEX+1)/POOL.length)*100 + "%";
    
    setTimeout(function() { showAnalysis(data); el.remove(); }, 300);
}

/**
 * Deep Analysis Modal Logic
 */
function showAnalysis(data) {
    document.getElementById('modal-analysis').innerHTML = data.analysis;
    var stepsArr = data.next_steps.split('. ');
    var stepsHTML = "";
    for(var i=0; i<stepsArr.length; i++) { 
        stepsHTML += '<div class="next-step-item">' + stepsArr[i] + '</div>'; 
    }
    document.getElementById('modal-next').innerHTML = stepsHTML;
    document.getElementById('analysis-modal').classList.add('open');
}

function closeModal() { document.getElementById('analysis-modal').classList.remove('open'); INDEX++; renderCard(); }
function resetCard(el) { el.style.transition = '0.3s ease'; el.style.transform = 'rotate(0deg)'; el.querySelector('#q-text').style.opacity = 1; el.querySelector('#ov-text').style.opacity = 0; }
function renderEnd() { document.getElementById('stage').innerHTML = '<div class="card" style="justify-content:center; align-items:center;"><div class="card-q">CALIBRATION COMPLETE</div><button class="modal-btn" onclick="location.reload()" style="width:80%; margin-top:30px;">RESTART</button></div>'; }

// Initialize
renderCard();
