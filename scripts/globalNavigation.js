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

// Initialize on load
document.addEventListener('DOMContentLoaded', initHamburgerMenu);
