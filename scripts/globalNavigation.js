/**
 * Global Navigation Script
 * Attaches to all pages to verify Auth state and manipulate the Header login button.
 */

document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();

    // Listen for custom login event from loginModal.js
    window.addEventListener('auth:login-success', () => {
        updateNavigation();
        // Option to redirect to profile on successful login
        // window.location.href = 'profile.html';
    });

    // Listen for custom logout event
    window.addEventListener('auth:logout', () => {
        updateNavigation();
    });
});

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

        // --- AI Image Search Injection ---
        const imgBtn = document.createElement('button');
        imgBtn.className = 'image-search-btn';
        imgBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>';
        imgBtn.style.cssText = 'position: absolute; right: 40px; background: none; border: none; color: #fff; cursor: pointer; padding: 8px; top: 50%; transform: translateY(-50%); opacity: 0.7; transition: opacity 0.2s;';
        imgBtn.title = "Search by Image (AI)";
        
        imgBtn.onmouseover = () => imgBtn.style.opacity = '1';
        imgBtn.onmouseout = () => imgBtn.style.opacity = '0.7';

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        imgBtn.onclick = (e) => {
            e.preventDefault();
            fileInput.click();
        };

        fileInput.onchange = async (e) => {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const imgUrl = URL.createObjectURL(file);
                
                input.value = "Analyzing Image with AI...";
                input.disabled = true;

                try {
                    await loadAIImageSearch();
                    const img = new Image();
                    img.src = imgUrl;
                    img.onload = async () => {
                        const predictions = await window.mobilenetModel.classify(img);
                        console.log("AI Image Predictions:", predictions);
                        
                        let foundKeyword = predictions[0].className.split(',')[0].toLowerCase();
                        
                        // Map to internal categories
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

                        let mappedSearch = foundKeyword;
                        for (let [key, val] of Object.entries(aiCategoryMap)) {
                            if (predictions.some(p => p.className.toLowerCase().includes(key))) {
                                mappedSearch = val;
                                break;
                            }
                        }

                        input.disabled = false;
                        input.value = mappedSearch;
                        handleSearch(mappedSearch);
                    };
                } catch (err) {
                    console.error("AI Error:", err);
                    input.disabled = false;
                    input.value = "";
                    alert("Failed to analyze image. Please try again.");
                }
            }
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
