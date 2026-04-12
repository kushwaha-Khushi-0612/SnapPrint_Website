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
        productId = `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    } = config;

    // Calculate discount percentage
    const discountPercent = originalPrice && originalPrice > price 
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    // Generate star rating
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return `
        <a href="${link}" class="product-card-link" style="text-decoration: none; color: inherit; display: block; height: 100%;">
            <div class="product-card-detail ${variant ? `product-card-${variant}` : ''}" data-product-id="${productId}">
                ${badge ? `<div class="product-badge">${badge}</div>` : ''}
                
                <div class="product-card-image">
                    <img src="${image}" alt="${title}" loading="lazy">
                    ${showWishlist ? `
                        <button class="wishlist-btn" onclick="event.preventDefault(); event.stopPropagation(); toggleWishlist('${productId}')" data-product-id="${productId}" aria-label="Add to wishlist">
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

    // Attach wishlist event listeners
    attachWishlistListeners(container);

    // Add staggered animation
    if (staggerAnimation) {
        const cards = container.querySelectorAll('.product-card');
        cards.forEach((card, index) => {
            card.style.animation = `fadeInUp 0.5s ease-out ${index * 0.05}s both`;
        });
    }
}

/**
 * Attach wishlist button event listeners
 * @param {HTMLElement} container - Container element
 */
function attachWishlistListeners(container) {
    const wishlistButtons = container.querySelectorAll('.wishlist-btn');
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = button.dataset.productId;
            const isActive = button.classList.contains('active');
            
            if (isActive) {
                button.classList.remove('active');
                removeFromWishlist(productId);
            } else {
                button.classList.add('active');
                addToWishlist(productId);
                
                // Add animation
                button.style.animation = 'heartBeat 0.5s ease';
                setTimeout(() => {
                    button.style.animation = '';
                }, 500);
            }
        });
    });
}

/**
 * Add product to wishlist
 * @param {string} productId - Product ID
 */
function addToWishlist(productId) {
    let wishlist = getWishlist();
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        saveWishlist(wishlist);
        console.log(`Product ${productId} added to wishlist`);
        // TODO: Trigger wishlist update event
    }
}

/**
 * Remove product from wishlist
 * @param {string} productId - Product ID
 */
function removeFromWishlist(productId) {
    let wishlist = getWishlist();
    wishlist = wishlist.filter(id => id !== productId);
    saveWishlist(wishlist);
    console.log(`Product ${productId} removed from wishlist`);
    // TODO: Trigger wishlist update event
}

/**
 * Get wishlist from localStorage
 * @returns {Array} Array of product IDs
 */
function getWishlist() {
    const wishlist = localStorage.getItem('snapprint_wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
}

/**
 * Save wishlist to localStorage
 * @param {Array} wishlist - Array of product IDs
 */
function saveWishlist(wishlist) {
    localStorage.setItem('snapprint_wishlist', JSON.stringify(wishlist));
}

/**
 * Initialize wishlist states for products on page
 */
function initializeWishlistStates() {
    const wishlist = getWishlist();
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    
    wishlistButtons.forEach(button => {
        const productId = button.dataset.productId;
        if (wishlist.includes(productId)) {
            button.classList.add('active');
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