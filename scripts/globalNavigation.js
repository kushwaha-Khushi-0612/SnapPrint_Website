/**
 * Global Navigation Script
 * Attaches to all pages to verify Auth state and manipulate the Header login button.
 */

// ===== GLOBAL TOAST SYSTEM =====
(function() {
    if (document.getElementById('sp-toast-container')) return;
    const c = document.createElement('div');
    c.id = 'sp-toast-container';
    c.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:999999;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
    document.body ? document.body.appendChild(c) : document.addEventListener('DOMContentLoaded', () => document.body.appendChild(c));

    const style = document.createElement('style');
    style.textContent = `
        .sp-toast { background:#1a1a1a; color:#fff; padding:13px 18px; border-radius:12px;
            font-family:'Inter',sans-serif; font-size:13px; font-weight:500;
            display:flex; align-items:center; gap:10px; min-width:240px; pointer-events:all;
            box-shadow:0 8px 32px rgba(0,0,0,0.35); animation:spToastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
        .sp-toast.out { animation:spToastOut 0.3s ease both; }
        .sp-toast.success { border-left:3px solid #22c55e; }
        .sp-toast.error   { border-left:3px solid #ef4444; }
        .sp-toast.info    { border-left:3px solid #6366f1; }
        @keyframes spToastIn  { from{opacity:0;transform:translateX(60px)} to{opacity:1;transform:translateX(0)} }
        @keyframes spToastOut { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(60px)} }
    `;
    document.head.appendChild(style);
})();

window.showToast = function(msg, type = 'info', duration = 3000) {
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    let c = document.getElementById('sp-toast-container');
    if (!c) { c = document.createElement('div'); c.id = 'sp-toast-container'; document.body.appendChild(c); }
    const t = document.createElement('div');
    t.className = `sp-toast ${type}`;
    t.innerHTML = `<span>${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
    c.appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 350); }, duration);
};

document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    updateWishlistBadge();

    // Listen for custom login event from loginModal.js
    window.addEventListener('auth:login-success', () => {
        updateNavigation();
        updateWishlistBadge();
    });

    // Listen for custom logout event
    window.addEventListener('auth:logout', () => {
        updateNavigation();
        updateWishlistBadge();
    });

    // Update badge whenever wishlist changes
    window.addEventListener('wishlist:updated', () => updateWishlistBadge());

    // Intercept wishlist:require-login → open login modal
    window.addEventListener('wishlist:require-login', () => {
        if (window.loginModal) window.loginModal.open();
    });
});

function updateWishlistBadge() {
    const badge = document.getElementById('wishlist-badge');
    if (!badge) return;
    const count = window.wishlistService ? window.wishlistService.getAll().length : 0;
    if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = 'flex';
        badge.style.animation = 'none';
        requestAnimationFrame(() => {
            badge.style.animation = 'badgePop 0.35s cubic-bezier(0.4,0,0.2,1)';
        });
    } else {
        badge.style.display = 'none';
    }
}

// Inject badge animation style once
(function() {
    if (document.getElementById('badge-anim-style')) return;
    const s = document.createElement('style');
    s.id = 'badge-anim-style';
    s.textContent = `
        @keyframes badgePop {
            0%   { transform: scale(0.5); opacity: 0; }
            70%  { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1);   opacity: 1; }
        }
        .wishlist-badge {
            position: absolute; top: -6px; right: -6px;
            background: linear-gradient(135deg, #ff4d6d, #ff6b6b);
            color: #fff; font-size: 10px; font-weight: 700;
            min-width: 18px; height: 18px; border-radius: 999px;
            display: flex; align-items: center; justify-content: center;
            padding: 0 4px; line-height: 1;
            box-shadow: 0 2px 8px rgba(255,77,109,0.4);
            pointer-events: none;
        }
        #wishlist-header-btn { position: relative; }
    `;
    document.head.appendChild(s);
})();


function updateNavigation() {
    const loginBtn = document.querySelector('.login-btn');
    if (!loginBtn) return;

    const user = window.authService ? window.authService.getCurrentUser() : null;

    if (user) {
        // User is logged in -> Show Profile Button
        // We'll replace the existing contents of the button
        loginBtn.innerHTML = `
            <img src="constants/icons/user-check.svg" alt="Profile" class="icon" onerror="this.src='constants/icons/user.svg'">
            <span>Profile</span>
        `;
        
        // Remove standard login click mechanism (if attached inline) and route to Profile
        loginBtn.onclick = (e) => {
            e.preventDefault();
            window.location.href = 'profile.html';
        };
    } else {
        // User is NOT logged in -> Show Login Button
        loginBtn.innerHTML = `
            <img src="constants/icons/user.svg" alt="Login" class="icon">
            <span>Login</span>
        `;
        
        // Ensure Modal triggers
        loginBtn.onclick = (e) => {
            e.preventDefault();
            if (window.loginModal) {
                window.loginModal.open();
            } else {
                console.error("Login modal not initialized.");
            }
        };
    }
}

/**
 * Initialize hamburger menu for mobile
 */
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const headerActions = document.querySelector('.header-actions');

    if (hamburger && headerActions) {
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            hamburger.classList.toggle('active');
            headerActions.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !headerActions.contains(e.target)) {
                hamburger.classList.remove('active');
                headerActions.classList.remove('active');
            }
        });
    }
}

function initGlobalSearch() {
    const searchInputs = document.querySelectorAll('.search-bar input');
    const searchBtns = document.querySelectorAll('.search-btn');

    const handleSearch = (val) => {
        if (!val.trim()) return;
        
        // Save to search history
        let history = JSON.parse(localStorage.getItem('search_history') || '[]');
        history = history.filter(item => item !== val.trim()); // remove duplicate
        history.unshift(val.trim()); // add to top
        if (history.length > 5) history.pop(); // keep 5
        localStorage.setItem('search_history', JSON.stringify(history));

        // If we are already on searchPage, we might have an executeGlobalSearch override
        if (window.executeGlobalSearch) {
            window.executeGlobalSearch(val.trim());
        } else {
            window.location.href = `searchPage.html?q=${encodeURIComponent(val.trim())}`;
        }
    };

    searchInputs.forEach((input, index) => {
        const wrapper = input.parentElement;
        wrapper.style.position = 'relative';

        const historyDropdown = document.createElement('div');
        historyDropdown.className = 'search-history-dropdown';
        historyDropdown.style.cssText = 'position: absolute; top: 100%; left: 0; right: 0; background: #fff; color: #333; z-index: 1000; display: none; box-shadow: 0 8px 24px rgba(0,0,0,0.2); border-radius: 8px; margin-top: 4px; overflow: hidden;';
        wrapper.appendChild(historyDropdown);

        const renderHistory = () => {
            const history = JSON.parse(localStorage.getItem('search_history') || '[]');
            if (history.length === 0) {
                historyDropdown.style.display = 'none';
                return;
            }
            let html = '<div style="padding: 10px 16px; font-size: 11px; color: #888; background: #fafafa; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; font-weight: 600; text-transform: uppercase;"><span>Recent Searches</span><span style="cursor:pointer; color: #ff4757;" onclick="localStorage.removeItem(\'search_history\'); this.parentElement.parentElement.style.display=\'none\'">Clear</span></div>';
            history.forEach(item => {
                html += `<div class="history-item" style="padding: 12px 16px; cursor: pointer; border-bottom: 1px solid #f1f1f1; display: flex; align-items: center; gap: 12px; font-size: 14px; color: #333;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='transparent'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> ${item}</div>`;
            });
            historyDropdown.innerHTML = html;
            
            historyDropdown.querySelectorAll('.history-item').forEach((el, i) => {
                el.addEventListener('mousedown', (e) => { 
                    e.preventDefault();
                    input.value = history[i];
                    handleSearch(history[i]);
                    historyDropdown.style.display = 'none';
                });
            });
            historyDropdown.style.display = 'block';
        };

        input.addEventListener('focus', renderHistory);
        input.addEventListener('click', renderHistory);
        input.addEventListener('input', () => {
            if (input.value.trim().length > 0) {
                historyDropdown.style.display = 'none'; // hide history when typing
            } else {
                renderHistory();
            }
        });
        
        input.addEventListener('blur', () => {
            historyDropdown.style.display = 'none';
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                historyDropdown.style.display = 'none';
                handleSearch(input.value);
            }
        });
        
        if (searchBtns[index]) {
            searchBtns[index].addEventListener('click', (e) => {
                e.preventDefault();
                historyDropdown.style.display = 'none';
                handleSearch(input.value);
            });
        }

        // --- AI Image Search: Camera Button ---
        const imgBtn = document.createElement('button');
        imgBtn.className = 'image-search-btn';
        imgBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>';
        imgBtn.style.cssText = 'position: absolute; right: 40px; background: none; border: none; color: #fff; cursor: pointer; padding: 8px; top: 50%; transform: translateY(-50%); opacity: 0.7; transition: opacity 0.2s;';
        imgBtn.title = "Search by Image (AI)";
        imgBtn.onmouseover = () => imgBtn.style.opacity = '1';
        imgBtn.onmouseout  = () => imgBtn.style.opacity = '0.7';

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        imgBtn.onclick = (e) => { e.preventDefault(); fileInput.click(); };

        // Inject AI overlay styles once
        if (!document.getElementById('ai-overlay-styles')) {
            const s = document.createElement('style');
            s.id = 'ai-overlay-styles';
            s.textContent = `
                #ai-scan-overlay {
                    position: fixed; inset: 0; z-index: 99999;
                    background: rgba(0,0,0,0.96);
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                    gap: 24px;
                    animation: aiOverlayIn 0.4s cubic-bezier(0.4,0,0.2,1) both;
                    backdrop-filter: blur(12px);
                }
                @keyframes aiOverlayIn {
                    from { opacity: 0; transform: scale(1.03); }
                    to   { opacity: 1; transform: scale(1); }
                }
                #ai-scan-overlay.ai-exit {
                    animation: aiPixelExit 0.6s cubic-bezier(0.4,0,0.2,1) both !important;
                }
                @keyframes aiPixelExit {
                    0%   { opacity: 1; filter: blur(0px) brightness(1); transform: scale(1); }
                    40%  { opacity: 1; filter: blur(2px) brightness(1.4); transform: scale(1.03); }
                    100% { opacity: 0; filter: blur(20px) brightness(2); transform: scale(1.1); }
                }

                /* Prediction typewriter row */
                #ai-prediction-row {
                    display: flex; flex-direction: column; align-items: center;
                    gap: 6px; min-height: 52px;
                }
                .ai-pred-label {
                    font-family: 'Inter', sans-serif;
                    font-size: 11px; font-weight: 600; letter-spacing: 2px;
                    color: rgba(255,255,255,0.35); text-transform: uppercase;
                }
                .ai-pred-text {
                    font-family: 'Inter', sans-serif;
                    font-size: 22px; font-weight: 800; color: #fff;
                    letter-spacing: -0.5px; min-height: 28px;
                    background: linear-gradient(90deg, #a78bfa, #ec4899, #f59e0b);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: shimmerText 2s linear infinite;
                    background-size: 200%;
                }
                @keyframes shimmerText {
                    0%   { background-position: 0% center; }
                    100% { background-position: 200% center; }
                }

                /* Image frame */
                #ai-scan-overlay .ai-img-frame {
                    position: relative; width: 280px; height: 280px;
                    border-radius: 24px; overflow: hidden;
                    box-shadow: 0 0 0 1px rgba(255,255,255,0.08),
                                0 0 80px rgba(159,122,234,0.2),
                                0 40px 80px rgba(0,0,0,0.5);
                    transform-origin: center;
                    animation: imgFrameIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both 0.1s;
                }
                @keyframes imgFrameIn {
                    from { transform: scale(0.7) rotate(-4deg); opacity: 0; }
                    to   { transform: scale(1) rotate(0deg); opacity: 1; }
                }
                #ai-scan-overlay .ai-img-frame img {
                    width: 100%; height: 100%; object-fit: cover;
                    transition: transform 0.6s ease;
                }
                #ai-scan-overlay .ai-img-frame:hover img { transform: scale(1.06); }

                /* Aurora fill layer */
                #ai-scan-overlay .ai-fill-layer {
                    position: absolute; inset: 0;
                    background: linear-gradient(
                        170deg,
                        rgba(99,179,237,0.8) 0%,
                        rgba(159,122,234,0.85) 35%,
                        rgba(237,100,166,0.8) 65%,
                        rgba(251,191,36,0.7) 100%
                    );
                    background-size: 200% 200%;
                    animation: auroraShift 3s ease infinite;
                    transform-origin: bottom;
                    transform: scaleY(0);
                    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
                    will-change: transform;
                }
                @keyframes auroraShift {
                    0%,100% { background-position: 0% 50%; }
                    50%     { background-position: 100% 50%; }
                }

                /* Scanline grid overlay on image */
                #ai-scan-overlay .ai-grid-overlay {
                    position: absolute; inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
                    background-size: 20px 20px;
                    pointer-events: none;
                }

                /* Moving scanline */
                #ai-scan-overlay .ai-scan-line {
                    position: absolute; left: -10%; right: -10%; height: 3px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.9), rgba(139,92,246,0.9), rgba(255,255,255,0.9), transparent);
                    box-shadow: 0 0 16px 6px rgba(139,92,246,0.5);
                    bottom: 0;
                    transition: bottom 0.3s cubic-bezier(0.4,0,0.2,1);
                    will-change: bottom;
                }

                /* Corner brackets */
                #ai-scan-overlay .ai-corner {
                    position: absolute; width: 24px; height: 24px;
                    border-color: rgba(139,92,246,0.8); border-style: solid;
                    transition: all 0.4s ease;
                }
                #ai-scan-overlay .ai-corner.tl { top: 8px; left: 8px; border-width: 3px 0 0 3px; border-radius: 4px 0 0 0; }
                #ai-scan-overlay .ai-corner.tr { top: 8px; right: 8px; border-width: 3px 3px 0 0; border-radius: 0 4px 0 0; }
                #ai-scan-overlay .ai-corner.bl { bottom: 8px; left: 8px; border-width: 0 0 3px 3px; border-radius: 0 0 0 4px; }
                #ai-scan-overlay .ai-corner.br { bottom: 8px; right: 8px; border-width: 0 3px 3px 0; border-radius: 0 0 4px 0; }

                /* Status text */
                #ai-scan-overlay .ai-status-text {
                    font-family: 'Inter', sans-serif;
                    font-size: 13px; font-weight: 600; letter-spacing: 1px;
                    color: rgba(255,255,255,0.5); text-transform: uppercase;
                    min-height: 20px; text-align: center;
                    transition: all 0.3s ease;
                }

                /* Result chip */
                #ai-scan-overlay .ai-keyword-chip {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: rgba(139,92,246,0.15);
                    border: 1px solid rgba(139,92,246,0.4);
                    color: #fff;
                    font-family: 'Inter', sans-serif;
                    font-size: 14px; font-weight: 600;
                    padding: 10px 22px; border-radius: 999px;
                    animation: chipIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
                    box-shadow: 0 0 20px rgba(139,92,246,0.3);
                }
                @keyframes chipIn {
                    from { opacity: 0; transform: translateY(12px) scale(0.85); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }

                /* Cancel btn */
                #ai-scan-overlay .ai-cancel-btn {
                    position: absolute; top: 24px; right: 24px;
                    background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.15);
                    color: rgba(255,255,255,0.6); padding: 8px 18px; border-radius: 999px;
                    font-size: 12px; font-weight: 600; cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    letter-spacing: 0.5px;
                    transition: all 0.2s;
                }
                #ai-scan-overlay .ai-cancel-btn:hover { background: rgba(255,80,80,0.15); border-color: rgba(255,80,80,0.3); color: #ff6b6b; }

                /* Progress bar underneath */
                #ai-progress-bar-wrap {
                    width: 280px; height: 3px;
                    background: rgba(255,255,255,0.08);
                    border-radius: 999px; overflow: hidden;
                }
                #ai-progress-bar {
                    height: 100%; width: 0%;
                    background: linear-gradient(90deg, #a78bfa, #ec4899, #f59e0b);
                    background-size: 200%;
                    border-radius: 999px;
                    transition: width 0.3s ease;
                    animation: shimmerBar 1.5s linear infinite;
                }
                @keyframes shimmerBar { 0%{background-position:0%} 100%{background-position:200%} }
            `;
            document.head.appendChild(s);
        }

        const aiPredictionLabels = [
            'Scanning pixels…', 'Detecting shapes…', 'Extracting features…',
            'Cross-referencing catalog…', 'Matching product class…'
        ];

        const showAIOverlay = (imgUrl) => {
            const overlay = document.createElement('div');
            overlay.id = 'ai-scan-overlay';
            overlay.innerHTML = `
                <button class="ai-cancel-btn" id="ai-cancel-btn">✕ Cancel</button>

                <div id="ai-prediction-row">
                    <div class="ai-pred-label">AI is detecting</div>
                    <div class="ai-pred-text" id="ai-pred-text">…</div>
                </div>

                <div class="ai-img-frame" id="ai-img-frame">
                    <img src="${imgUrl}" alt="Analyzing…" id="ai-preview-img">
                    <div class="ai-fill-layer" id="ai-fill-layer"></div>
                    <div class="ai-grid-overlay"></div>
                    <div class="ai-scan-line" id="ai-scan-line"></div>
                    <div class="ai-corner tl"></div>
                    <div class="ai-corner tr"></div>
                    <div class="ai-corner bl"></div>
                    <div class="ai-corner br"></div>
                </div>

                <div class="ai-status-text" id="ai-status-text">Initializing…</div>
                <div id="ai-progress-bar-wrap"><div id="ai-progress-bar"></div></div>
                <div id="ai-chip-area" style="min-height:44px;"></div>
            `;
            document.body.appendChild(overlay);
            document.getElementById('ai-cancel-btn').onclick = () => overlay.remove();

            // Start typewriter cycling of dummy detections
            let twIdx = 0;
            overlay._twInterval = setInterval(() => {
                const el = document.getElementById('ai-pred-text');
                if (el) {
                    twIdx = (twIdx + 1) % aiPredictionLabels.length;
                    el.style.opacity = '0';
                    setTimeout(() => {
                        if (el) { el.textContent = aiPredictionLabels[twIdx]; el.style.opacity = '1'; }
                    }, 200);
                }
            }, 900);

            return overlay;
        };

        const setAIProgress = (pct, statusText) => {
            const fill = document.getElementById('ai-fill-layer');
            const line = document.getElementById('ai-scan-line');
            const status = document.getElementById('ai-status-text');
            const bar = document.getElementById('ai-progress-bar');
            if (fill) fill.style.transform = `scaleY(${pct / 100})`;
            if (line) line.style.bottom = `${pct}%`;
            if (status && statusText) status.textContent = statusText;
            if (bar) bar.style.width = `${pct}%`;
        };

        const showAIChip = (label, overlay) => {
            // Stop typewriter, set final prediction
            if (overlay._twInterval) clearInterval(overlay._twInterval);
            const pred = document.getElementById('ai-pred-text');
            if (pred) { pred.style.opacity = '0'; setTimeout(() => { if(pred) { pred.textContent = label; pred.style.opacity = '1'; } }, 200); }

            const area = document.getElementById('ai-chip-area');
            if (area) area.innerHTML = `<div class="ai-keyword-chip"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> ${label}</div>`;
        };

        const exitAIOverlay = (overlay, callback) => {
            overlay.classList.add('ai-exit');
            setTimeout(callback, 550);
            setTimeout(() => overlay.remove(), 620);
        };

        fileInput.onchange = async (e) => {
            if (!e.target.files || !e.target.files[0]) return;
            const file = e.target.files[0];
            const imgUrl = URL.createObjectURL(file);

            const overlay = showAIOverlay(imgUrl);

            let fakePct = 0;
            const warmup = setInterval(() => {
                fakePct = Math.min(fakePct + 1.2, 28);
                setAIProgress(fakePct, 'Loading AI Model…');
            }, 40);

            try {
                await loadAIImageSearch();
                clearInterval(warmup);

                setAIProgress(35, 'Scanning image…');
                await new Promise(res => setTimeout(res, 80));

                const img = new Image();
                img.src = imgUrl;
                await new Promise(res => { img.onload = res; });

                setAIProgress(52, 'Analyzing pixels…');
                await new Promise(res => setTimeout(res, 60));

                const predictions = await window.mobilenetModel.classify(img);
                console.log('AI Predictions:', predictions);

                setAIProgress(74, 'Matching catalog…');
                await new Promise(res => setTimeout(res, 100));

                const aiCategoryMap = {
                    'shirt': 't-shirts', 'jersey': 't-shirts', 'tee': 't-shirts',
                    'hoodie': 'hoodies', 'sweatshirt': 'hoodies', 'jacket': 'hoodies',
                    'mug': 'mugs & cups', 'cup': 'mugs & cups', 'coffee': 'mugs & cups',
                    'bag': 'tote bags', 'purse': 'tote bags', 'backpack': 'tote bags',
                    'chain': 'jewelry', 'necklace': 'jewelry', 'pendant': 'pendants',
                    'case': 'phone cases', 'cellular telephone': 'phone cases', 'phone': 'phone cases',
                    'frame': 'photo frames', 'picture': 'photo frames',
                    'shoe': 'footwear', 'sneaker': 'footwear', 'boot': 'footwear'
                };

                let mappedSearch = predictions[0].className.split(',')[0].toLowerCase();
                for (let [key, val] of Object.entries(aiCategoryMap)) {
                    if (predictions.some(p => p.className.toLowerCase().includes(key))) {
                        mappedSearch = val; break;
                    }
                }

                setAIProgress(90, 'Match found!');
                showAIChip(mappedSearch, overlay);
                await new Promise(res => setTimeout(res, 150));

                // Sweep to 100%
                let pct = 90;
                await new Promise(res => {
                    const finish = setInterval(() => {
                        pct = Math.min(pct + 2, 100);
                        setAIProgress(pct, '✅ Redirecting…');
                        if (pct >= 100) { clearInterval(finish); res(); }
                    }, 16);
                });

                await new Promise(res => setTimeout(res, 280));
                exitAIOverlay(overlay, () => {
                    input.value = mappedSearch;
                    handleSearch(mappedSearch);
                });

            } catch (err) {
                clearInterval(warmup);
                if (overlay._twInterval) clearInterval(overlay._twInterval);
                console.error('AI Error:', err);
                overlay.remove();
                alert('Failed to analyze image. Please try again.');
            }

            e.target.value = '';
        };

        wrapper.appendChild(imgBtn);

        wrapper.appendChild(fileInput);
    });
}

async function loadAIImageSearch() {
    if (window.mobilenetModel) return true;
    return new Promise((resolve, reject) => {
        if (!document.getElementById('tf-script')) {
            const tfScript = document.createElement('script');
            tfScript.id = 'tf-script';
            tfScript.src = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs";
            tfScript.onload = () => {
                const mnScript = document.createElement('script');
                mnScript.src = "https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet";
                mnScript.onload = async () => {
                    window.mobilenetModel = await mobilenet.load();
                    resolve(true);
                };
                document.head.appendChild(mnScript);
            };
            document.head.appendChild(tfScript);
        } else {
            // Already loading
            const check = setInterval(() => {
                if (window.mobilenetModel) {
                    clearInterval(check);
                    resolve(true);
                }
            }, 100);
        }
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initHamburgerMenu();
    initGlobalSearch();
});
