/**
 * Product Category Page Script
 * Handles category display, subcategories, and product listings
 */

// Get category from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const currentCategory = urlParams.get('category') || 'tshirts';

let categoryData = null;

// Hero background image slider
let currentSlide = 0;
const heroSlides = document.querySelectorAll('.hero-slide');

function rotateHeroBackground() {
    if (heroSlides.length === 0) return;
    
    heroSlides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % heroSlides.length;
    heroSlides[currentSlide].classList.add('active');
}

// Change hero background every 5 seconds
if (heroSlides.length > 0) {
    setInterval(rotateHeroBackground, 5000);
}

// Sample product data for demonstration
const generateCategoryProducts = (categoryName, count = 6) => {
    const products = [];
    const baseImages = [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop'
    ];
    
    for (let i = 0; i < count; i++) {
        const price = Math.floor(Math.random() * 500) + 299;
        const originalPrice = Math.floor(price * 1.5) + 100;
        const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
        
        products.push({
            title: `${categoryName} Design ${i + 1}`,
            description: `Premium custom ${categoryName.toLowerCase()}`,
            image: baseImages[i % baseImages.length],
            price: price,
            originalPrice: originalPrice,
            discount: discount,
            rating: (Math.random() * 1.5 + 3.5).toFixed(1),
            reviewCount: Math.floor(Math.random() * 500) + 50,
            link: `productDetails.html?id=${currentCategory}-${i}`,
            productId: `cat-${currentCategory}-${i}`
        });
    }
    
    return products;
};

// Mixed categories products (4-5 rows = 24-30 products)
const mixedCategoryProducts = [
    ...generateCategoryProducts('Mug', 6),
    ...generateCategoryProducts('Hoodie', 6),
    ...generateCategoryProducts('Phone Case', 6),
    ...generateCategoryProducts('Frame', 6),
    ...generateCategoryProducts('Keychain', 6)
];

// Previously viewed products
const previouslyViewedProducts = [
    {
        title: 'Custom Design Pro',
        description: 'Premium custom design',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        price: 499,
        originalPrice: 999,
        discount: 50,
        rating: 4.8,
        reviewCount: 234,
        link: 'productDetails.html?id=prev-1',
        productId: 'prev-001',
        viewedTime: 'Viewed 2 hours ago'
    },
    {
        title: 'Premium Quality Item',
        description: 'Premium custom item',
        image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop',
        price: 699,
        originalPrice: 1299,
        discount: 46,
        rating: 4.7,
        reviewCount: 189,
        link: 'productDetails.html?id=prev-2',
        productId: 'prev-002',
        viewedTime: 'Viewed yesterday'
    },
    {
        title: 'Classic Design',
        description: 'Premium classic design',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
        price: 549,
        originalPrice: 999,
        discount: 45,
        rating: 4.6,
        reviewCount: 156,
        link: 'productDetails.html?id=prev-3',
        productId: 'prev-003',
        viewedTime: 'Viewed 3 days ago'
    },
    {
        title: 'Modern Style',
        description: 'Premium modern style',
        image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop',
        price: 799,
        originalPrice: 1499,
        discount: 47,
        rating: 4.9,
        reviewCount: 345,
        link: 'productDetails.html?id=prev-4',
        productId: 'prev-004',
        viewedTime: 'Viewed last week'
    }
];

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Loading Product Category Page...');
    console.log('Current Category:', currentCategory);
    
    // Initialize hamburger menu
    initHamburgerMenu();
    
    // Load category data
    await loadCategoryData();
    
    // Render page sections
    if (categoryData) {
        updatePageHeader();
        loadHeroImages();
        renderSubcategories();
        renderRelatedProducts();
        renderPreviouslyViewed();
        renderMixedCategories();
    }
    
    console.log('✅ Product Category Page Ready!');
});

/**
 * Load hero background images based on category
 */
function loadHeroImages() {
    const categoryImages = {
        tshirts: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=600&fit=crop',
            'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=1200&h=600&fit=crop',
            'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1200&h=600&fit=crop'
        ],
        hoodies: [
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200&h=600&fit=crop',
            'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1200&h=600&fit=crop',
            'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=1200&h=600&fit=crop'
        ],
        cups: [
            'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=1200&h=600&fit=crop',
            'https://images.unsplash.com/photo-1609505833958-16f65ffb5ad1?w=1200&h=600&fit=crop',
            'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=1200&h=600&fit=crop'
        ],
        '2DMobileCover': [
            'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=1200&h=600&fit=crop',
            'https://images.unsplash.com/photo-1617296538902-887900d9b592?w=1200&h=600&fit=crop',
            'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=1200&h=600&fit=crop'
        ],
        woodenFrame: [
            'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=1200&h=600&fit=crop',
            'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=1200&h=600&fit=crop',
            'https://images.unsplash.com/photo-1594843267926-de1f6b5c7e29?w=1200&h=600&fit=crop'
        ],
        default: [
            'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1200&h=600&fit=crop',
            'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=1200&h=600&fit=crop',
            'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=1200&h=600&fit=crop'
        ]
    };
    
    const images = categoryImages[currentCategory] || categoryImages.default;
    const slides = document.querySelectorAll('.hero-slide');
    
    slides.forEach((slide, index) => {
        if (images[index]) {
            slide.style.backgroundImage = `linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(45,45,45,0.6) 100%), url('${images[index]}')`;
        }
    });
    
    // Load floating images
    const floatingImgs = document.querySelectorAll('.floating-img');
    floatingImgs.forEach((img, index) => {
        if (images[index % images.length]) {
            img.style.backgroundImage = `url('${images[index % images.length]}')`;
        }
    });
}

/**
 * Load category data from JSON
 */
async function loadCategoryData() {
    try {
        const response = await fetch('data/categories_subcategories.json');
        const data = await response.json();
        categoryData = data.categories[currentCategory];
        
        if (!categoryData) {
            console.error('Category not found:', currentCategory);
            // Fallback to tshirts
            categoryData = data.categories['tshirts'];
        }
    } catch (error) {
        console.error('Error loading category data:', error);
        // Fallback data
        categoryData = {
            name: 'Products',
            icon: '📦',
            description: 'Custom printed products',
            subcategories: []
        };
    }
}

/**
 * Update page header with category info
 */
function updatePageHeader() {
    document.getElementById('category-name').textContent = categoryData.name;
    document.getElementById('category-icon').textContent = categoryData.icon;
    document.getElementById('category-title').textContent = categoryData.name;
    document.getElementById('category-description').textContent = categoryData.description;
    document.title = `SnapPrint - ${categoryData.name}`;
}

/**
 * Render subcategory cards
 */
function renderSubcategories() {
    const subcategories = categoryData.subcategories || [];
    
    // Split into two sections: New Arrivals (first half) and Collections (second half)
    const midPoint = Math.ceil(subcategories.length / 2);
    const newArrivals = subcategories.slice(0, midPoint);
    const collections = subcategories.slice(midPoint);
    
    // Render New Arrivals
    const newArrivalsGrid = document.getElementById('new-arrivals-grid');
    newArrivalsGrid.innerHTML = newArrivals.map(sub => createSubcategoryCard(sub)).join('');
    
    // Render Collections
    const collectionsGrid = document.getElementById('collections-grid');
    collectionsGrid.innerHTML = collections.map(sub => createSubcategoryCard(sub)).join('');
    
    // Render Color Categories (T-Shirts only)
    if (categoryData.colorCategories && categoryData.colorCategories.length > 0) {
        const colorSection = document.getElementById('color-categories-section');
        const colorGrid = document.getElementById('color-categories-grid');
        colorSection.style.display = 'block';
        colorGrid.innerHTML = categoryData.colorCategories.map(color => createColorCard(color)).join('');
    }
    
    // Render GSM Categories (T-Shirts only)
    if (categoryData.gsmCategories && categoryData.gsmCategories.length > 0) {
        const gsmSection = document.getElementById('gsm-categories-section');
        const gsmGrid = document.getElementById('gsm-categories-grid');
        gsmSection.style.display = 'block';
        gsmGrid.innerHTML = categoryData.gsmCategories.map(gsm => createGSMCard(gsm)).join('');
    }
    
    // Update hero stats
    const totalProducts = (categoryData.subcategories?.length || 0) + 
                         (categoryData.colorCategories?.length || 0) + 
                         (categoryData.gsmCategories?.length || 0);
    const totalSubcategories = categoryData.subcategories?.length || 0;
    
    document.getElementById('total-products').textContent = `${totalProducts * 15}+`;
    document.getElementById('subcategory-count').textContent = totalSubcategories;
}

/**
 * Create subcategory card HTML
 */
function createSubcategoryCard(subcategory) {
    return `
        <div class="subcategory-card">
            <div class="subcategory-card-image">
                <img src="${subcategory.image}" alt="${subcategory.name}" loading="lazy">
                <div class="subcategory-wishlist" onclick="event.stopPropagation(); toggleWishlist('${subcategory.id}')">
                    <svg viewBox="0 0 24 24" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                </div>
            </div>
            <div class="subcategory-card-content">
                <h3 class="subcategory-name">${subcategory.name}</h3>
                <p class="subcategory-description">${subcategory.description}</p>
                <div class="subcategory-footer">
                    <div class="subcategory-count">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="7" height="7"/>
                            <rect x="14" y="3" width="7" height="7"/>
                            <rect x="14" y="14" width="7" height="7"/>
                            <rect x="3" y="14" width="7" height="7"/>
                        </svg>
                        ${subcategory.productCount || '25+'} Products
                    </div>
                    <div class="subcategory-actions">
                        <button class="subcategory-btn btn-explore" onclick="navigateToSubcategory('${subcategory.id}')">
                            <span>Explore</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </button>
                        <button class="subcategory-btn btn-view-more" onclick="navigateToSubcategory('${subcategory.id}')">
                            <span>View More</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Create color category card HTML
 */
function createColorCard(color) {
    return `
        <div class="subcategory-card color-card" data-color="${color.color}">
            <div class="subcategory-card-image">
                <img src="${color.image}" alt="${color.name}" loading="lazy">
                <div class="subcategory-wishlist" onclick="event.stopPropagation(); toggleWishlist('${color.id}')">
                    <svg viewBox="0 0 24 24" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                </div>
            </div>
            <div class="subcategory-card-content">
                <h3 class="subcategory-name">${color.name}</h3>
                <p class="subcategory-description">${color.description}</p>
                <div class="subcategory-footer">
                    <div class="subcategory-count">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="7" height="7"/>
                            <rect x="14" y="3" width="7" height="7"/>
                            <rect x="14" y="14" width="7" height="7"/>
                            <rect x="3" y="14" width="7" height="7"/>
                        </svg>
                        ${color.productCount || '30+'} Products
                    </div>
                    <div class="subcategory-actions">
                        <button class="subcategory-btn btn-explore" onclick="navigateToSubcategory('${color.id}')">
                            <span>Explore</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </button>
                        <button class="subcategory-btn btn-view-more" onclick="navigateToSubcategory('${color.id}')">
                            <span>View More</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Create GSM category card HTML
 */
function createGSMCard(gsm) {
    return `
        <div class="subcategory-card gsm-card">
            <div class="subcategory-card-image">
                <img src="${gsm.image}" alt="${gsm.name}" loading="lazy">
                <div class="subcategory-wishlist" onclick="event.stopPropagation(); toggleWishlist('${gsm.id}')">
                    <svg viewBox="0 0 24 24" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                </div>
            </div>
            <div class="subcategory-card-content">
                <h3 class="subcategory-name">${gsm.name} - ${gsm.gsm}GSM</h3>
                <p class="subcategory-description">${gsm.description}</p>
                <div class="subcategory-footer">
                    <div class="subcategory-count">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="7" height="7"/>
                            <rect x="14" y="3" width="7" height="7"/>
                            <rect x="14" y="14" width="7" height="7"/>
                            <rect x="3" y="14" width="7" height="7"/>
                        </svg>
                        ${gsm.productCount || '20+'} Products
                    </div>
                    <div class="subcategory-actions">
                        <button class="subcategory-btn btn-explore" onclick="navigateToSubcategory('${gsm.id}')">
                            <span>Explore</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </button>
                        <button class="subcategory-btn btn-view-more" onclick="navigateToSubcategory('${gsm.id}')">
                            <span>View More</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Navigate to subcategory
 */
function navigateToSubcategory(subcategoryId) {
    console.log('Navigate to:', currentCategory, subcategoryId);
    // Navigate to product listing page with filters
    window.location.href = `productDetails.html?category=${currentCategory}&subcategory=${subcategoryId}`;
}

/**
 * Render related products sections
 */
function renderRelatedProducts() {
    const categoryName = categoryData.name;
    
    // Section 1: Popular Choices
    document.getElementById('related-section-1-title').textContent = `Popular ${categoryName}`;
    const products1 = generateCategoryProducts(categoryName, 6);
    renderProducts(products1, 'related-products-1');
    
    // Section 2: Trending Now
    document.getElementById('related-section-2-title').textContent = `Trending ${categoryName}`;
    const products2 = generateCategoryProducts(categoryName, 6);
    renderProducts(products2, 'related-products-2');
    
    // Section 3: Best Sellers
    document.getElementById('related-section-3-title').textContent = `Best Selling ${categoryName}`;
    const products3 = generateCategoryProducts(categoryName, 6);
    renderProducts(products3, 'related-products-3');

    // Section 4: Seasonal Picks
    const seasonalPicks = generateCategoryProducts(categoryName + ' Summer', 6);
    renderProducts(seasonalPicks, 'seasonal-picks-grid');

    // Section 5: Under ₹499
    // Manipulate price to forcibly be under 499
    const under499 = generateCategoryProducts(categoryName, 8).map(p => {
        p.price = Math.floor(Math.random() * 200) + 199; // 199 to 399
        p.originalPrice = p.price + 200;
        p.badge = 'VALUE';
        return p;
    });
    renderProducts(under499, 'under-499-grid');
}

/**
 * Render previously viewed products
 */
function renderPreviouslyViewed() {
    renderProducts(previouslyViewedProducts, 'previously-viewed');
}

/**
 * Render mixed categories section
 */
function renderMixedCategories() {
    renderProducts(mixedCategoryProducts, 'mixed-categories');
}



/**
 * Initialize hamburger menu
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

        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !headerActions.contains(e.target)) {
                hamburger.classList.remove('active');
                headerActions.classList.remove('active');
            }
        });
    }
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Toggle wishlist
 */
function toggleWishlist(itemId) {
    const wishlistBtn = event.currentTarget;
    wishlistBtn.classList.toggle('active');
    
    // Show feedback
    const feedback = wishlistBtn.classList.contains('active') ? 'Added to wishlist' : 'Removed from wishlist';
    showNotification(feedback);
    
    console.log('Wishlist toggled:', itemId);
}

/**
 * Add to cart
 */
function addToCart(itemId) {
    showNotification('Added to cart!');
    console.log('Add to cart:', itemId);
}

/**
 * Show notification
 */
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        animation: slideInUp 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 2 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutDown 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

