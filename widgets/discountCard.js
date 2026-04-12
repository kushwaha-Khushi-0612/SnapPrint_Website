/**
 * SnapPrint Discount Card Widget
 * Renders a premium, animated discount card and handles 'Avail' logic.
 */

const createDiscountCard = (config) => {
    const { id, code, percentage, title, description, theme, pattern } = config;

    return `
        <div class="discount-card ${theme}" id="card-${id}">
            <div class="card-bg-pattern ${pattern}"></div>
            <div class="discount-content">
                <div class="discount-main">
                    <span class="discount-percent">${percentage}%</span>
                    <div class="discount-label">
                        <span class="off-text">OFF</span>
                        <span class="desc-text">${title}</span>
                    </div>
                </div>
                <p class="discount-detail">${description}</p>
                <div class="discount-actions">
                    <div class="coupon-code" onclick="copyToClipboard('${code}')">
                        <span class="code-val">${code}</span>
                        <img src="constants/icons/copy.svg" alt="Copy" class="icon-small">
                    </div>
                    <button class="avail-btn" onclick="availDiscount('${id}', '${code}')">
                        Avail Discount
                    </button>
                </div>
            </div>
            <div class="card-success-overlay">
                <div class="success-icon">✨</div>
                <p>Coupon Availed!</p>
            </div>
        </div>
    `;
};

// Logic for availing discount
window.availDiscount = async (id, code) => {
    const card = document.getElementById(`card-${id}`);
    if (!card) return;

    // 1. Success Animation
    card.classList.add('availed');
    
    // 2. Play sound/confetti if available (placeholder logic)
    console.log(`🎉 Discount Availed: ${code}`);

    // 3. Save to profile server-side
    if (window.authService) {
        try {
            const user = window.authService.getCurrentUser();
            if (user) {
                const currentCoupons = user.availedCoupons || [];
                if (!currentCoupons.includes(code)) {
                    await window.authService.updateProfile({
                        availedCoupons: [...currentCoupons, code]
                    });
                }
            } else {
                // Not logged in - maybe show login modal?
                if (window.showLoginModal) window.showLoginModal();
            }
        } catch (e) {
            console.warn('Failed to sync coupon to profile:', e);
        }
    }
    
    // 4. Feedback
    const btn = card.querySelector('.avail-btn');
    if (btn) {
        btn.innerText = 'Applied';
        btn.disabled = true;
    }
};

window.copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        // Show a small toast or message
    });
};

// Global export
window.createDiscountCard = createDiscountCard;
