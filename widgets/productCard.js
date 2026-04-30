/**
 * Product Card Widget
 * Creates customizable product cards with multiple variants
 * 
 * @param {Object} config - Configuration object
 * @param {string} config.title - Product title
 * @param {string} config.description - Product description
 * @param {string} config.image - Product image URL
 * @param {number} config.price - Current price
 * @param {number} config.originalPrice - Original price (for discount display)
 * @param {string} config.link - Product page link
 * @param {string} config.badge - Badge text (e.g., 'SALE', 'NEW')
 * @param {number} config.rating - Product rating (0-5)
 * @param {number} config.reviewCount - Number of reviews
 * @param {string} config.variant - Card style variant ('default', 'curved-bottom', 'curved-all')
 * @param {boolean} config.showWishlist - Show wishlist button (default: true)
 * @param {boolean} config.showRating - Show rating (default: true)
 * @param {boolean} config.showDiscount - Show discount percentage (default: true)
 * @param {string} config.productId - Unique product ID
 * @returns {string} HTML string for product card
 */

function createProductCard(config) {
    const {
        title,
        description = '',
        image,
        price,
        originalPrice = null,
        link = '#',
        badge = null,
        rating = 0,
        reviewCount = 0,
        variant = 'default',
        showWishlist = true,
        showRating = true,
        showDiscount = true,
        productId = config.id || `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    } = config;

    // Calculate discount percentage
    const discountPercent = originalPrice && originalPrice > price 
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    // Badge styling mapping
    const getBadgeClass = (badgeText) => {
        return badgeText ? 'badge-standard' : '';
    };

    // Dynamic SEO Keywords Mapping based on product title
    const seoKeywordsMap = {
        't-shirt': 'custom t shirts India, printed t shirts online, design your own t shirt',
        'hoodie': 'custom hoodies India, personalized hoodies, custom sweatshirts',
        'mug': 'custom mugs India, photo mugs online, birthday photo gifts',
        'frame': 'custom photo frames, photo collage prints, custom wall frames',
        'phone': 'custom phone cases, printed mobile covers',
        'keychain': 'custom keychains India, engraved accessories',
        'tote': 'custom tote bags, printed tote bags India',
        'kids': 'custom kids clothing, personalized kids wear',
        'default': 'personalized gifts online, custom printing India, print on demand India'
    };

    let dynamicKeywords = seoKeywordsMap['default'];
    if (title) {
        const lowerTitle = title.toLowerCase();
        for (const [key, keywords] of Object.entries(seoKeywordsMap)) {
            if (key !== 'default' && lowerTitle.includes(key)) {
                dynamicKeywords = keywords;
                break;
            }
        }
    }

    return `
        <a href="${link}" class="product-card-link" title="${title} | ${dynamicKeywords}" onclick="if(window.analyticsService) window.analyticsService.trackProductView(${JSON.stringify(config).replace(/"/g, '&quot;')});" style="text-decoration: none; color: inherit; display: block; height: 100%;">
            <div class="product-card-detail ${variant ? `product-card-${variant}` : ''}" data-product-id="${productId}" data-keywords="${dynamicKeywords}">
                <div class="badge-stack">
                    ${badge ? `<div class="product-badge badge-standard">${badge}</div>` : ''}
                    ${config.productTag ? `<div class="product-tag">${config.productTag}</div>` : ''}
                </div>
                
                <div class="product-card-image">
                    <img src="${image}" alt="${title} - ${dynamicKeywords}" loading="lazy">
                    ${showWishlist ? `
                        <button class="wishlist-btn" data-product-id="${productId}" aria-label="Add to wishlist">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        </button>
                    ` : ''}
                </div>

                <div class="product-card-info">
                    <h3 class="product-card-title">${title}</h3>
                    
                    ${description ? `<p class="product-card-description">${description}</p>` : ''}
                    
                    ${showRating && rating > 0 ? `
                        <div class="product-card-rating">
                            <div class="rating-badge">
                                <span class="rating-value">${rating}</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFA500" stroke="none">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                            </div>
                            ${reviewCount > 0 ? `<span class="review-count">(${reviewCount.toLocaleString()})</span>` : ''}
                        </div>
                    ` : ''}

                    <div class="product-card-pricing">
                        <div class="product-price-row">
                            <span class="product-discount">₹${price.toLocaleString('en-IN')}</span>
                            ${originalPrice && originalPrice > price ? `
                                <span class="product-original-price">₹${originalPrice.toLocaleString('en-IN')}</span>
                            ` : ''}
                            ${showDiscount && discountPercent > 0 ? `
                                <span class="product-discount-badge">${discountPercent}% OFF</span>
                            ` : ''}
                        </div>
                    </div>
                </div>
                <button class="product-card-arrow" aria-label="View product">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </button>
            </div>
        </a>
    `;
}

/**
 * Batch create multiple product cards
 * @param {Array} products - Array of product config objects
 * @param {string} containerId - Container element ID
 * @param {Object} options - Additional options
 */
function renderProducts(products, containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { variant = 'default', staggerAnimation = true } = options;

    const html = products.map(product => 
        createProductCard({ ...product, variant })
    ).join('');
    
    container.innerHTML = html;
    
    // Add reveal classes for scroll animation
    container.classList.add('reveal', 'reveal-up');

    // Attach wishlist event listeners
    attachWishlistListeners(container);

    // Initialise with ScrollReveal if available
    if (window.ScrollReveal) {
        window.ScrollReveal.observe(container);
    }
}

/**
 * Attach wishlist button event listeners (auth-aware via wishlistService)
 * @param {HTMLElement} container
 */
function attachWishlistListeners(container) {
    // First sync existing state
    initializeWishlistStates();

    const wishlistButtons = container.querySelectorAll('.wishlist-btn');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const productId = button.dataset.productId;

            // Require login via wishlistService
            const user = window.authService?.getCurrentUser();
            if (!user) {
                window.dispatchEvent(new CustomEvent('wishlist:require-login'));
                // Shake the button to hint login needed
                button.style.animation = 'none';
                requestAnimationFrame(() => { button.style.animation = 'wlShake 0.4s ease'; });
                return;
            }

            const isActive = button.classList.contains('active');

            if (isActive) {
                button.classList.remove('active');
                window.wishlistService?.remove(productId);
                button.style.animation = 'none';
                requestAnimationFrame(() => { button.style.animation = 'heartBeat 0.35s ease'; });
            } else {
                button.classList.add('active');
                window.wishlistService?.add(productId);
                // Premium heart burst effect
                heartBurst(button);
            }
        });
    });
}

/**
 * Heart burst particle effect
 */
function heartBurst(button) {
    const rect = button.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    for (let i = 0; i < 8; i++) {
        const p = document.createElement('div');
        const angle = (i / 8) * 360;
        const dist = 28 + Math.random() * 16;
        p.style.cssText = `
            position: fixed;
            left: ${cx}px; top: ${cy}px;
            width: 7px; height: 7px;
            border-radius: 50%;
            background: ${['#ff4d6d','#ff6b6b','#ff8fa3','#ffc2d1'][i % 4]};
            pointer-events: none; z-index: 99999;
            transform: translate(-50%, -50%);
            animation: particleFly 0.55s cubic-bezier(0.4,0,0.2,1) forwards;
            --dx: ${Math.cos(angle * Math.PI / 180) * dist}px;
            --dy: ${Math.sin(angle * Math.PI / 180) * dist}px;
        `;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 600);
    }
    button.style.animation = 'none';
    requestAnimationFrame(() => { button.style.animation = 'heartBeat 0.5s ease'; });
}

// Particle keyframe injection
(function() {
    if (document.getElementById('heart-burst-style')) return;
    const s = document.createElement('style');
    s.id = 'heart-burst-style';
    s.textContent = `
        @keyframes particleFly {
            0%   { transform: translate(-50%,-50%) scale(1); opacity: 1; }
            100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0); opacity: 0; }
        }
        @keyframes wlShake {
            0%,100% { transform: translateX(0); }
            20%     { transform: translateX(-5px) rotate(-8deg); }
            40%     { transform: translateX(5px) rotate(8deg); }
            60%     { transform: translateX(-4px) rotate(-5deg); }
            80%     { transform: translateX(4px) rotate(5deg); }
        }
        .wishlist-btn.active svg { fill: #ff4d6d; stroke: #ff4d6d; }
        .wishlist-btn.active { background: #fff0f3 !important; }
    `;
    document.head.appendChild(s);
})();

/**
 * Sync wishlist button states from wishlistService
 */
function initializeWishlistStates() {
    if (!window.wishlistService) return;
    const ids = window.wishlistService.getIds();
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        if (ids.includes(btn.dataset.productId)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Add heart beat animation and additional styles
const style = document.createElement('style');
style.textContent = `
    @keyframes heartBeat {
        0%, 100% { transform: scale(1); }
        25% { transform: scale(1.3); }
        50% { transform: scale(1.1); }
        75% { transform: scale(1.25); }
    }

    .product-bottom-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-top: auto;
    }

    .product-price-group {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
        flex: 1;
        min-width: 0;
        overflow: hidden;
    }

    .product-arrow-btn {
        width: 40px;
        height: 40px;
        background: var(--color-black);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        flex-shrink: 0;
    }

    .product-arrow-btn svg {
        stroke: var(--color-white);
    }

    .product-arrow-btn:hover {
        transform: scale(1.1) rotate(5deg);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .product-card-curved-bottom {
        border-bottom-left-radius: 32px;
        border-bottom-right-radius: 32px;
    }

    .product-card-curved-all {
        border-radius: 24px;
    }

    .badge-stack {
        position: absolute;
        top: 12px;
        left: 12px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        z-index: 5;
        pointer-events: none;
    }

    .product-tag, .product-badge {
        position: static !important;
        background: #000;
        color: #fff;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        width: fit-content;
        pointer-events: auto;
    }

    .rating-count {
        color: var(--text-meta);
    }
`;
document.head.appendChild(style);

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        createProductCard, 
        renderProducts, 
        addToWishlist, 
        removeFromWishlist, 
        getWishlist,
        initializeWishlistStates
    };
}