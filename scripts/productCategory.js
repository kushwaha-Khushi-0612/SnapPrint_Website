/**
 * Product Category Page Script
 * Handles category display, subcategories, and product listings
 */

// Get category from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const currentCategory = urlParams.get('category') || 'tshirts';

// Initialize data state
let categoryData = null;
let categoryProducts = [];

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

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Loading Product Category Page...');
    console.log('Current Category:', currentCategory);
    
    // Load category data via dataService
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
        'T-Shirts': [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=600&fit=crop',
            'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=1200&h=600&fit=crop',
            'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1200&h=600&fit=crop'
        ],
        'Hoodies': [
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200&h=600&fit=crop',
            'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1200&h=600&fit=crop',
            'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=1200&h=600&fit=crop'
        ],
        'Mugs': [
            'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=1200&h=600&fit=crop',
            'https://images.unsplash.com/photo-1609505833958-16f65ffb5ad1?w=1200&h=600&fit=crop',
            'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=1200&h=600&fit=crop'
        ],
        'Phone Cases': [
            'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=1200&h=600&fit=crop',
            'https://images.unsplash.com/photo-1617296538902-887900d9b592?w=1200&h=600&fit=crop',
            'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=1200&h=600&fit=crop'
        ],
        'Frames': [
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
    
    const images = categoryImages[categoryData.name] || categoryImages.default;
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
 * Load category data from dataService
 */
async function loadCategoryData() {
    await window.dataService.init();
    const db = window.dataService.productsDB;
    
    // Find category (case insensitive match of URL param)
    let catRegex = new RegExp(currentCategory, 'i');
    categoryData = db.categories.find(c => catRegex.test(c.name));
    
    if (!categoryData) {
        console.error('Category not found:', currentCategory);
        categoryData = db.categories[0]; // fallback
    }

    // Set icons
    const iconsMap = {
        'T-Shirts': 'constants/icons/tshirt.svg',
        'Hoodies': 'constants/icons/hoodie.svg',
        'Phone Cases': 'constants/icons/phone-case.svg',
        'Mugs': 'constants/icons/mug.svg',
        'Frames': 'constants/icons/frame.svg',
        'Keychains': 'constants/icons/keychain.svg',
        'Tote Bags': 'constants/icons/tote-bag.svg',
        'Masks': 'constants/icons/facemask.svg',
        'Kids Clothing': 'constants/icons/tshirt.svg',
        'Jewelry': 'constants/icons/pendant.svg',
        'Footwear': 'constants/icons/slipper.svg',
        'Decor': 'constants/icons/star.svg'
    };
    
    categoryData.icon = iconsMap[categoryData.name] || 'constants/icons/star.svg';
    categoryData.description = `Premium custom ${categoryData.name.toLowerCase()}`;
    
    // Fetch products belonging to this category
    categoryProducts = await window.dataService.getProductsByCategory(categoryData.name);

    // Track category view for personalization
    if (window.analyticsService) {
        window.analyticsService.trackCategoryClick(categoryData.name);
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
    const mainGrid = document.getElementById('new-arrivals-grid');
    const secondaryGrid = document.getElementById('collections-grid');
    
    if (categoryData.sections) {
        // Collect all subcategories from all sections
        const allSubcategories = categoryData.sections.flatMap(s => s.subcategories);
        
        // 1. Populate New Arrivals (Main Grid)
        // Find subcategories that have "New Arrival" tagged products, otherwise just take the first few
        let newArrivalSubs = allSubcategories.filter(sub => 
            sub.products && sub.products.some(p => p.badge === 'New Arrival' || p.badge === 'New')
        );
        
        if (newArrivalSubs.length === 0) {
            newArrivalSubs = allSubcategories.slice(0, 4);
        } else {
            newArrivalSubs = newArrivalSubs.slice(0, 4);
        }
        
        mainGrid.innerHTML = newArrivalSubs.map(sub => {
            if (!sub.image && sub.products && sub.products.length > 0) sub.image = sub.products[0].image;
            return createSubcategoryCard(sub);
        }).join('');
        mainGrid.style.display = 'grid'; // Ensure it's visible

        // 2. Populate Collections (Secondary Grid)
        const collections = allSubcategories
            .filter(sub => !newArrivalSubs.find(nas => nas.id === sub.id))
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
            
        secondaryGrid.innerHTML = collections.map(sub => {
            if (!sub.image && sub.products && sub.products.length > 0) sub.image = sub.products[0].image;
            return createSubcategoryCard(sub);
        }).join('');

        // 3. Render the specific sections separately
        categoryData.sections.forEach((section, index) => {
            const sectionHtml = `
                <div class="category-section-header">
                    <h2 class="section-title">${section.name}</h2>
                </div>
                <div class="product-grid" id="section-grid-${index}">
                    ${section.subcategories.map(sub => {
                        if (!sub.image && sub.products && sub.products.length > 0) {
                            sub.image = sub.products[0].image;
                        }
                        return createSubcategoryCard(sub);
                    }).join('')}
                </div>
            `;
            
            // Insert sections after the main grids to keep New Arrivals at the top
            if (index === 0) {
                // Insert after NEW ARRIVALS
                mainGrid.parentElement.insertAdjacentHTML('afterend', sectionHtml);
            } else {
                // Insert after COLLECTIONS
                secondaryGrid.parentElement.insertAdjacentHTML('afterend', sectionHtml);
            }
        });
    } else {
        const subcategories = categoryData.subcategories || [];
        const midPoint = Math.ceil(subcategories.length / 2);
        const newArrivals = subcategories.slice(0, midPoint);
        const collections = subcategories.slice(midPoint);
        
        mainGrid.innerHTML = newArrivals.map(sub => {
            if (!sub.image && sub.products && sub.products.length > 0) sub.image = sub.products[0].image;
            return createSubcategoryCard(sub);
        }).join('');
        
        secondaryGrid.innerHTML = collections.map(sub => {
            if (!sub.image && sub.products && sub.products.length > 0) sub.image = sub.products[0].image;
            return createSubcategoryCard(sub);
        }).join('');
    }
    
    // Render Color/GSM logic stays same...
    
    // Update hero stats
    let totalProductsCount = 0;
    let subCount = 0;
    if (categoryData.sections) {
        categoryData.sections.forEach(s => {
            subCount += s.subcategories.length;
            s.subcategories.forEach(sub => totalProductsCount += sub.products.length);
        });
    } else {
        subCount = categoryData.subcategories?.length || 0;
        categoryData.subcategories?.forEach(sub => totalProductsCount += sub.products.length);
    }
    
    document.getElementById('total-products').textContent = `${totalProductsCount}+`;
    document.getElementById('subcategory-count').textContent = subCount;

    // Render Additional Personalized Sections
    renderPersonalizedSections();
}

/**
 * Render recommendations and history at the bottom
 */
async function renderPersonalizedSections() {
    // 1. Previously Viewed
    const history = await window.dataService.getRecentlyViewedProducts(4);
    if (history.length > 0) {
        document.getElementById('previously-viewed').parentElement.style.display = 'block';
        renderProducts(history, 'previously-viewed', { variant: 'default' });
    } else {
        document.getElementById('previously-viewed').parentElement.style.display = 'none';
    }

    // 2. Budget Section (Under 499)
    const budgetProds = categoryProducts.filter(p => p.price < 500).slice(0, 4);
    if (budgetProds.length > 0) {
        renderProducts(budgetProds, 'under-499-grid', { variant: 'curved-all' });
    }

    const recommended = await window.dataService.getRecommendedProducts(6);
    const mixedGrid = document.getElementById('mixed-categories');
    if (mixedGrid) {
        renderProducts(recommended, 'mixed-categories', { variant: 'colored' });
        mixedGrid.classList.add('product-grid-dense');
    }

    const randomFinal = await window.dataService.getRandomProducts(12);
    const randomContainer = document.getElementById('random-discoveries');
    if (randomContainer) {
        renderProducts(randomFinal, 'random-discoveries', { variant: 'default' });
        randomContainer.classList.add('product-grid-dense');
    }
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
async function renderRelatedProducts() {
    const categoryName = categoryData.name;
    
    // Safety check - if category has no products, fetch some random ones
    let sourceProducts = categoryProducts;
    if (!sourceProducts || sourceProducts.length === 0) {
        sourceProducts = await window.dataService.getRandomProducts(20);
    }

    // Shuffle helper
    const shuffle = arr => [...arr].sort(() => 0.5 - Math.random());
    
    // Section 1: Popular Choices
    document.getElementById('related-section-1-title').textContent = `Popular ${categoryName}`;
    const products1 = shuffle(sourceProducts).slice(0, 6);
    renderProducts(products1, 'related-products-1');
    
    // Section 2: Trending Now
    document.getElementById('related-section-2-title').textContent = `Trending ${categoryName}`;
    const products2 = shuffle(sourceProducts).slice(0, 6);
    renderProducts(products2, 'related-products-2');
    
    // Section 3: Best Sellers
    document.getElementById('related-section-3-title').textContent = `Best Selling ${categoryName}`;
    const products3 = shuffle(sourceProducts).slice(0, 6);
    renderProducts(products3, 'related-products-3');

    // Section 4: Seasonal Picks
    const seasonalPicks = shuffle(sourceProducts).slice(0, 6);
    renderProducts(seasonalPicks, 'seasonal-picks-grid');

    // Section 5: Under ₹499
    // Manipulate price to forcibly be under 499 for display if needed, or filter
    let under499 = sourceProducts.filter(p => p.price < 500);
    if (under499.length < 8) {
        // Mock the price if not enough
        under499 = shuffle(sourceProducts).slice(0, 8).map(p => {
            return {...p, price: Math.floor(Math.random() * 200) + 199, badge: 'VALUE'};
        });
    } else {
        under499 = shuffle(under499).slice(0, 8);
    }
    renderProducts(under499, 'under-499-grid');
}

/**
 * Render previously viewed products
 */
async function renderPreviouslyViewed() {
    const prevViewed = await window.dataService.getRandomProducts(4);
    // Add view time mock
    prevViewed.forEach(p => p.viewedTime = 'Viewed recently');
    renderProducts(prevViewed, 'previously-viewed');
}

/**
 * Render mixed categories section
 */
async function renderMixedCategories() {
    const mixed = await window.dataService.getRandomProducts(30);
    renderProducts(mixed, 'mixed-categories');
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

