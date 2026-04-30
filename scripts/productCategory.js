/**
 * Product Category Page Script
 * Handles category display, subcategories, and product listings
 */

// Get category from URL parameter
const urlParams = new URLSearchParams(window.location.search);
// Handle both 'tshirts' and 't-shirts' in URL
const categoryParam = urlParams.get('category') || 't-shirts';
const currentCategory = categoryParam.toLowerCase().includes('tshirt') ? 't-shirts' : categoryParam;

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
    // Be more flexible with dashes in category names
    const normalizedParam = currentCategory.replace(/[-\s]/g, '');
    categoryData = db.categories.find(c => {
        const normalizedName = c.name.replace(/[-\s]/g, '').toLowerCase();
        return normalizedName === normalizedParam.toLowerCase() || 
               c.id.toLowerCase().includes(normalizedParam.toLowerCase());
    });
    
    if (!categoryData) {
        console.warn('Category not found:', currentCategory, 'Falling back to first available.');
        categoryData = db.categories[0]; 
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
    
    // SEO Data Mapping
    const seoData = {
        'T-Shirts': {
            title: 'Custom T-Shirts Printing Online India | Design Your Own T-Shirt – SnapPrint',
            desc: 'Design and order custom t-shirts online in India with SnapPrint. High-quality printing, trendy designs, and fast delivery. Create your own t-shirt now!'
        },
        'Hoodies': {
            title: 'Custom Hoodies & Sweatshirts India | Personalized Hoodie Printing – SnapPrint',
            desc: 'Create your own hoodies and sweatshirts with custom prints. Perfect for gifts, brands, and personal use. Premium quality with fast delivery across India.'
        },
        'Kids Clothing': {
            title: 'Custom Kids Clothing India | Personalized Kids T-Shirts & Wear – SnapPrint',
            desc: 'Shop custom kids clothing online in India. Print names, photos, and designs on kids t-shirts and outfits. Safe fabric, vibrant prints, and quick delivery.'
        },
        'Mugs': {
            title: 'Custom Mugs Printing Online India | Personalized Photo Mugs – SnapPrint',
            desc: 'Design custom mugs with photos, names, or quotes. Perfect gifts for birthdays, anniversaries, and special occasions. Order personalized mugs online today!'
        },
        'Keychains': {
            title: 'Custom Keychains Online India | Personalized Keychain Printing – SnapPrint',
            desc: 'Create personalized keychains with photos or text. Stylish, durable, and perfect for gifting. Order custom keychains online with fast delivery in India.'
        },
        'Phone Cases': {
            title: 'Custom Phone Cases India | Personalized Mobile Covers Online – SnapPrint',
            desc: 'Design your own phone cases with photos, names, or artwork. High-quality printed mobile covers for all models. Order custom phone cases online now.'
        },
        'Frames': {
            title: 'Custom Photo Frames Online India | Personalized Picture Frames – SnapPrint',
            desc: 'Turn your memories into beautiful custom photo frames. Perfect for home decor and gifting. High-quality prints with fast delivery across India.'
        },
        'Tote Bags': {
            title: 'Custom Tote Bags India | Personalized Printed Tote Bags Online – SnapPrint',
            desc: 'Shop custom tote bags with unique prints and designs. Eco-friendly, stylish, and perfect for daily use or gifting. Design your tote bag online today!'
        },
        'Jewelry': {
            title: 'Custom Photo Pendants India | Personalized Jewelry Online – SnapPrint',
            desc: 'Create personalized pendants with your photo or name. Unique jewelry for gifting or personal style. Order custom pendants online with premium finish.'
        }
    };

    const currentSeo = seoData[categoryData.name] || {
        title: `Custom ${categoryData.name} India | Personalized Gifts Online – SnapPrint`,
        desc: `Browse custom ${categoryData.name.toLowerCase()} at SnapPrint. High-quality personalized products with fast delivery across India.`
    };

    document.title = currentSeo.title;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute("content", currentSeo.desc);
    } else {
        const newMetaDesc = document.createElement('meta');
        newMetaDesc.name = "description";
        newMetaDesc.content = currentSeo.desc;
        document.head.appendChild(newMetaDesc);
    }
}

/**
 * Render subcategory cards
 */
function renderSubcategories() {
    const mainGrid = document.getElementById('new-arrivals-grid');
    const secondaryGrid = document.getElementById('collections-grid');
    
    const isSpecialCategory = ['T-Shirts', 'Hoodies'].includes(categoryData.name);

    if (isSpecialCategory && categoryData.sections) {
        // Clear existing grids
        mainGrid.parentElement.style.display = 'none';
        secondaryGrid.parentElement.style.display = 'none';
        
        // Render the specific sections separately (Men/Women)
        // Use a wrapper to maintain order
        const dynamicContainerId = 'dynamic-sections-container';
        let dynamicContainer = document.getElementById(dynamicContainerId);
        
        if (!dynamicContainer) {
            dynamicContainer = document.createElement('div');
            dynamicContainer.id = dynamicContainerId;
            secondaryGrid.parentElement.insertAdjacentElement('afterend', dynamicContainer);
        } else {
            dynamicContainer.innerHTML = '';
        }

        categoryData.sections.forEach((section, index) => {
            if (!section.subcategories || section.subcategories.length === 0) return;
            
            const sectionHtml = `
                <section class="subcategory-section category-dynamic-section">
                    <div class="category-section-header">
                        <h2 class="section-title">${section.name}</h2>
                    </div>
                    <div class="subcategory-grid" id="section-grid-${index}">
                        ${section.subcategories.map(sub => {
                            // Sub.products might not be pre-loaded, check existence safely
                            if (!sub.image && sub.products && sub.products.length > 0) {
                                sub.image = sub.products[0].image;
                            }
                            return createSubcategoryCard(sub);
                        }).join('')}
                    </div>
                </section>
            `;
            dynamicContainer.insertAdjacentHTML('beforeend', sectionHtml);
        });
    } else {
        // For other categories or if sections don't exist, use standard grid
        mainGrid.parentElement.style.display = 'block';
        secondaryGrid.parentElement.style.display = 'block';
        
        const subcategories = categoryData.subcategories || [];
        // Flatten sections if they exist but we are not in special category
        const allSubs = categoryData.sections 
            ? categoryData.sections.flatMap(s => s.subcategories)
            : subcategories;

        const midPoint = Math.ceil(allSubs.length / 2);
        const newArrivals = allSubs.slice(0, midPoint);
        const collections = allSubs.slice(midPoint);
        
        mainGrid.innerHTML = newArrivals.map(sub => {
            if (!sub.image && sub.products && sub.products.length > 0) {
                sub.image = sub.products[0].image || '';
            }
            return createSubcategoryCard(sub);
        }).join('');
        
        secondaryGrid.innerHTML = collections.map(sub => {
            if (!sub.image && sub.products && sub.products.length > 0) {
                sub.image = sub.products[0].image || '';
            }
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
            s.subcategories.forEach(sub => {
                // Safely handle missing products array (using productCount string if available)
                const count = sub.products ? sub.products.length : (parseInt(sub.productCount) || 0);
                totalProductsCount += count;
            });
        });
    } else {
        subCount = categoryData.subcategories?.length || 0;
        categoryData.subcategories?.forEach(sub => {
            const count = sub.products ? sub.products.length : (parseInt(sub.productCount) || 0);
            totalProductsCount += count;
        });
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
    const isActive = window.wishlistService?.has(subcategory.id) ? 'active' : '';
    return `
        <div class="subcategory-card">
            <div class="subcategory-card-image">
                ${subcategory.image ? `<img src="${subcategory.image}" alt="${subcategory.name}" loading="lazy">` : ''}
                <div class="subcategory-wishlist ${isActive}" onclick="event.stopPropagation(); toggleWishlist('${subcategory.id}')">
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
    const isActive = window.wishlistService?.has(color.id) ? 'active' : '';
    return `
        <div class="subcategory-card color-card" data-color="${color.color}">
            <div class="subcategory-card-image">
                <img src="${color.image}" alt="${color.name}" loading="lazy">
                <div class="subcategory-wishlist ${isActive}" onclick="event.stopPropagation(); toggleWishlist('${color.id}')">
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
    const isActive = window.wishlistService?.has(gsm.id) ? 'active' : '';
    return `
        <div class="subcategory-card gsm-card">
            <div class="subcategory-card-image">
                <img src="${gsm.image}" alt="${gsm.name}" loading="lazy">
                <div class="subcategory-wishlist ${isActive}" onclick="event.stopPropagation(); toggleWishlist('${gsm.id}')">
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
    window.location.href = `searchPage.html?category=${currentCategory}&subcategory=${subcategoryId}`;
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
 * Toggle wishlist for subcategories
 */
function toggleWishlist(itemId) {
    if (!window.wishlistService) return;
    
    // Check if user is logged in first
    const user = window.authService?.getCurrentUser();
    if (!user) {
        window.dispatchEvent(new CustomEvent('wishlist:require-login'));
        return;
    }
    
    const wishlistBtn = event.currentTarget;
    const isNowActive = !wishlistBtn.classList.contains('active');
    
    if (isNowActive) {
        wishlistBtn.classList.add('active');
        window.wishlistService.add(itemId, 'subcategory');
        showNotification('Added collection to wishlist');
    } else {
        wishlistBtn.classList.remove('active');
        window.wishlistService.remove(itemId);
        showNotification('Removed collection from wishlist');
    }
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

