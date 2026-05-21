/**
 * Product Details Page Script
 */

// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id') || 'prod-001';

/// Global state
let productData = null;

/**
 * Helper to get clean views and high-quality lifestyle/template image placeholders per product category
 */
function getCategoryViewsAndImages(category, originalImages) {
    const cat = (category || '').toLowerCase();
    
    // Curated high-quality mockups and lifestyle templates for EVERY category (exactly 4 images each!)
    const galleryConfigs = {
        tshirt: {
            views: ['front', 'back', 'left_sleeve', 'right_sleeve'],
            images: [
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop", // Front mockup (Customizable)
                "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=600&fit=crop", // Back mockup (Customizable)
                "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=600&fit=crop", // Left Sleeve mockup (Customizable)
                "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=600&fit=crop&q=80" // Right Sleeve mockup (Customizable)
            ]
        },
        hoodie: {
            views: ['front', 'back'],
            images: [
                "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop", // Front mockup (Customizable)
                "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop&q=80", // Back mockup (Customizable)
                "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop", // Sleeve angled angle (Lifestyle)
                "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop&q=80" // Studio backdrop lifestyle (Lifestyle)
            ]
        },
        cap: {
            views: ['front'],
            images: [
                "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=600&fit=crop", // Front panel mockup (Customizable)
                "https://images.unsplash.com/photo-1534215754734-18e55d13ce35?w=600&h=600&fit=crop", // Side profile angle (Lifestyle)
                "https://images.unsplash.com/photo-1572375995501-4b0894d53c69?w=600&h=600&fit=crop", // Angled back buckle (Lifestyle)
                "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop"  // Lifestyle model wear (Lifestyle)
            ]
        },
        bottle: {
            views: ['front'],
            images: [
                "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop", // Front print zone mockup (Customizable)
                "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop", // Detailed zoom lid cap (Lifestyle)
                "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&h=600&fit=crop", // Dynamic backdrop side (Lifestyle)
                "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=600&h=600&fit=crop"  // Lifestyle outdoor desk (Lifestyle)
            ]
        },
        mug: {
            views: ['front', 'back', 'wrap'],
            images: [
                "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop", // Front mockup (Customizable)
                "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=600&fit=crop&q=80", // Back mockup (Customizable)
                "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&h=600&fit=crop", // Full wrap printing area (Customizable)
                "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=600&h=600&fit=crop"  // Lifestyle coffee setting (Lifestyle)
            ]
        },
        phonecase: {
            views: ['back'],
            images: [
                "https://images.unsplash.com/photo-1580870013141-3bad09490e04?w=600&h=600&fit=crop", // Back case custom zone (Customizable)
                "https://images.unsplash.com/photo-1601784551446-20c9e09cd90f?w=600&h=600&fit=crop", // Front glass view (Lifestyle)
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop", // Symmetrical side bumper (Lifestyle)
                "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop"  // Lifestyle hand holding case (Lifestyle)
            ]
        },
        mask: {
            views: ['front'],
            images: [
                "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop", // Front flat printed mask (Customizable)
                "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=600&fit=crop", // Curved layout side (Lifestyle)
                "https://images.unsplash.com/photo-1586942593568-293c15d51b8d?w=600&h=600&fit=crop", // Lifestyle wear zoom (Lifestyle)
                "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=600&h=600&fit=crop"  // Close-up fabric texture (Lifestyle)
            ]
        },
        keychain: {
            views: ['front'],
            images: [
                "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&h=600&fit=crop", // Metal keyring template (Customizable)
                "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&h=600&fit=crop", // Detailed leather keychain zoom (Angled)
                "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&h=600&fit=crop", // Premium lifestyle leather keyring (Lifestyle)
                "https://images.unsplash.com/photo-1522273400909-fd1a8f77637e?w=600&h=600&fit=crop"  // Keyring hanging on backpack (Lifestyle)
            ]
        },
        decor: {
            views: ['front'],
            images: [
                "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&h=600&fit=crop", // Acrylic/stone photo print stand (Customizable)
                "https://images.unsplash.com/photo-1544273677-c433136021d4?w=600&h=600&fit=crop", // Angle close up (Lifestyle)
                "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&h=600&fit=crop", // Dynamic backdrop shelf (Lifestyle)
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=600&fit=crop"  // Interior living room zoom (Lifestyle)
            ]
        }
    };

    let key = 'decor'; // SAFE DEFAULT: Unknown categories default to high-end single-view decor/gift items!
    if (cat.includes('hoodie')) key = 'hoodie';
    else if (cat.includes('cap') || cat.includes('hat')) key = 'cap';
    else if (cat.includes('bottle') || cat.includes('sipper') || cat.includes('drink') || cat.includes('flask')) key = 'bottle';
    else if (cat.includes('mug') || cat.includes('cup')) key = 'mug';
    else if (cat.includes('phone') || cat.includes('case')) key = 'phonecase';
    else if (cat.includes('mask')) key = 'mask';
    else if (cat.includes('keychain') || cat.includes('key chain') || cat.includes('key_chain') || cat.includes('key')) key = 'keychain';
    else if (cat.includes('t-shirt') || cat.includes('tshirt') || cat.includes('tee') || cat.includes('shirt')) key = 'tshirt';
    else if (cat.includes('decor') || cat.includes('frame') || cat.includes('stone') || cat.includes('crystal') || cat.includes('canvas')) key = 'decor';

    const selected = galleryConfigs[key] || galleryConfigs['decor'];
    const views = selected.views;
    
    // Copy template images array to avoid mutating the master gallery config
    const images = [...selected.images];

    // Inject the actual product database image as the customizable primary angle (images[0])
    if (originalImages && originalImages.length > 0) {
        images[0] = originalImages[0];
    }

    // Map each customizable view to its respective mockup template image
    const config = {};
    views.forEach((view, idx) => {
        config[view] = images[idx];
    });

    return { views, images, config };
}

// Sample reviews data
const reviewsData = [
    {
        name: 'Rahul Sharma',
        rating: 5,
        date: '2 days ago',
        text: 'Excellent quality! The print is very sharp and the fabric feels premium. Highly recommended for custom printing.'
    },
    {
        name: 'Priya Patel',
        rating: 4,
        date: '1 week ago',
        text: 'Good product overall. The t-shirt fits well and the print quality is nice. Delivery was fast too.'
    },
    {
        name: 'Amit Kumar',
        rating: 5,
        date: '2 weeks ago',
        text: 'Best custom t-shirts I\'ve ordered! The quality is outstanding and the colors are vibrant. Will order again!'
    },
    {
        name: 'Sneha Verma',
        rating: 4,
        date: '3 weeks ago',
        text: 'Nice fabric quality and good print. Slightly expensive but worth it for the quality you get.'
    },
    {
        name: 'Vikram Singh',
        rating: 5,
        date: '1 month ago',
        text: 'Perfect for my business merchandise! Ordered 50 pieces and all came out perfectly. Great service!'
    }
];

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Loading Product Details Page...');

    await window.dataService.init();
    await loadProductData();

    if (productData) {
        // Setup image gallery
        setupImageGallery();

        // Setup size selection
        setupSizeSelection();

        // Setup color selection
        setupColorSelection();

        // Setup quantity controls
        setupQuantityControls();

        // Setup action buttons
        setupActionButtons();

        // Setup customizer canvas
        setTimeout(() => setupCustomizer(), 500); // Small delay to let images load

        // Setup tabs
        setupTabs();

        // Load reviews (mock)
        loadReviews();

        // Load product sections dynamically
        const categoryName = productData.categoryName || productData.category;
        let related = await window.dataService.getProductsByCategory(categoryName);
        if (related.length === 0) related = await window.dataService.getRandomProducts(10);

        const shuffle = arr => [...arr].sort(() => 0.5 - Math.random());

        renderProducts(shuffle(related).slice(0, 8), 'viral-products');
        renderProducts(await window.dataService.getRandomProducts(8), 'most-viewed-products');
        renderProducts(await window.dataService.getRandomProducts(12), 'mixed-category-products');
        renderProducts(shuffle(related).slice(0, 8), 'related-products');
        renderProducts(await window.dataService.getRandomProducts(6), 'customers-also-bought');

        const prevViewed = await window.dataService.getRandomProducts(4);
        prevViewed.forEach(p => p.viewedTime = 'Viewed recently');
        renderProducts(prevViewed, 'previously-viewed');

        const bundled = await window.dataService.getRandomProducts(4);
        bundled.forEach(p => p.badge = 'BUNDLE SAVE');
        renderProducts(bundled, 'bundled-offers');

        renderProducts(await window.dataService.getRandomProducts(24), 'mixed-categories-final');
    }

    console.log('✅ Product Details Page Ready!');
});

/**
 * Load product data into page
 */
async function loadProductData() {
    productData = await window.dataService.getProductById(productId);

    if (!productData) {
        console.error("Product not found:", productId);
        // Load a random product as fallback if dev test links are broken
        const randoms = await window.dataService.getRandomProducts(1);
        productData = randoms[0];
        if (!productData) return;
    }

    // Build the dynamic image paths if they exist
    let imageArray = productData.images || [];
    if (productData.baseImagePath && productData.images) {
        imageArray = productData.images.map(img => productData.baseImagePath + img);
    } else if (productData.image) {
        imageArray = [productData.image];
    }
    productData.images = imageArray;

    // Fill missing mock data since JSON might be sparse
    productData.category = productData.categoryName || 'T-Shirts';

    // Resolve dynamic multi-view customizer images based on product category
    const catDetails = getCategoryViewsAndImages(productData.category, productData.images);
    productData.images = catDetails.images;
    productData.views = catDetails.views;
    productData.viewPlaceholders = catDetails.config;
    productData.categoryLink = `productCategory.html?category=${encodeURIComponent(productData.category)}`;
    productData.description = productData.description || 'Premium quality print material.';
    productData.sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    productData.colors = [
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Grey', hex: '#808080' },
        { name: 'Navy', hex: '#001f3f' }
    ];
    productData.highlights = [
        'Premium quality material',
        'Vibrant & long-lasting colors',
        'Custom verified print'
    ];

    // Dynamically show/hide sizes and color selections for non-apparel products
    const sizeSelectionEl = document.querySelector('.size-selection');
    const colorSelectionEl = document.querySelector('.color-selection');
    const isApparel = catDetails.views.length > 1; // Shirts, Mugs, Hoodies have multiple print views! Single view products don't need size/color selections.
    
    if (sizeSelectionEl) sizeSelectionEl.style.display = isApparel ? 'block' : 'none';
    if (colorSelectionEl) colorSelectionEl.style.display = isApparel ? 'block' : 'none';

    // Update breadcrumb
    const breadCat = document.getElementById('breadcrumb-category');
    if (breadCat) {
        breadCat.textContent = productData.category;
        breadCat.href = productData.categoryLink;
    }
    const breadProd = document.getElementById('breadcrumb-product');
    if (breadProd) breadProd.textContent = productData.title;

    // Update product info
    document.getElementById('product-category').textContent = productData.category;
    document.getElementById('product-title').textContent = productData.title;
    document.getElementById('rating-value').textContent = productData.rating || 4.5;

    let rvCount = productData.reviewCount || 100;
    document.getElementById('review-count').textContent = rvCount.toLocaleString();
    if (document.getElementById('review-count-tab')) document.getElementById('review-count-tab').textContent = rvCount.toLocaleString();

    // Calculate discount
    const discount = Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100);
    document.getElementById('discount-badge').textContent = `-${discount}%`;
    document.getElementById('current-price').textContent = `₹${productData.price}`;
    document.getElementById('original-price').textContent = `₹${productData.originalPrice}`;

    // Update badge
    const badgeEl = document.getElementById('product-badge');
    if (productData.badge) {
        badgeEl.textContent = productData.badge;
        badgeEl.style.display = 'inline-block';
    } else {
        if (badgeEl) badgeEl.style.display = 'none';
    }

    // Update description
    document.getElementById('product-description').textContent = productData.description;

    // Update highlights
    const highlightsList = document.getElementById('product-highlights-list');
    if (highlightsList) highlightsList.innerHTML = productData.highlights.map(h => `<li>${h}</li>`).join('');

    document.title = `${productData.title} - SnapPrint`;
}

// Helper to ensure external images don't block canvas due to restrictive CORS policies
function getCorsProxyUrl(url) {
    if (!url || !url.startsWith('http')) return url;
    if (url.includes('unsplash.com')) return url; // Unsplash supports wildcard CORS natively
    
    // Route through our local PHP proxy to reliably fetch binary images while bypassing CDN blocks
    const currentDomain = window.location.origin;
    const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
    return `${currentDomain}${basePath}/proxy.php?url=` + encodeURIComponent(url);
}

/**
 * Setup image gallery
 */
function setupImageGallery() {
    const mainImage = document.getElementById('main-product-image');
    const thumbnailGallery = document.getElementById('thumbnail-gallery');

    // Force default main image source to match the category's first preview image immediately on page load!
    if (mainImage && productData.images && productData.images.length > 0) {
        const primarySrc = productData.images[0];
        mainImage.crossOrigin = 'anonymous';
        mainImage.src = getCorsProxyUrl(primarySrc);
    }

    // Create a gorgeous floating "Lifestyle Preview Only" badge overlay inside customizer container
    let badge = document.getElementById('preview-only-badge');
    if (!badge) {
        badge = document.createElement('div');
        badge.id = 'preview-only-badge';
        badge.style.cssText = 'display: none; position: absolute; top: 15px; left: 15px; background: rgba(15, 23, 42, 0.85); color: #fff; padding: 6px 12px; font-size: 10px; font-weight: 700; border-radius: 20px; z-index: 100; backdrop-filter: blur(4px); letter-spacing: 0.5px; text-transform: uppercase; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.1);';
        badge.textContent = 'Preview Angle';
        const container = document.getElementById('customizer-container');
        if (container) container.appendChild(badge);
    }

    // Create thumbnails
    thumbnailGallery.innerHTML = productData.images.map((img, index) => `
        <div class="thumbnail ${index === 0 ? 'active' : ''}" data-image="${img}" data-index="${index}">
            <img src="${img}" alt="Product view ${index + 1}">
        </div>
    `).join('');

    // Add click handlers
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', () => {
            const index = parseInt(thumb.dataset.index, 10);

            // Change the main product image to the thumbnail's image
            const clickedSrc = thumb.dataset.image;
            mainImage.crossOrigin = 'anonymous';
            mainImage.src = getCorsProxyUrl(clickedSrc);

            // Update active state class for thumbnails
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');

            const wrapper = document.querySelector('.canvas-wrapper');
            const toolbar = document.querySelector('.floating-toolbar');
            const badge = document.getElementById('preview-only-badge');

            if (productData.views.length > 1) {
                // MULTI-VIEW CATEGORY (e.g. T-shirts/Hoodies where every side is customizable)
                const viewName = productData.views[index] || productData.views[0];

                // Switch customizer view
                if (typeof window.switchCustomizerView === 'function') {
                    window.switchCustomizerView(viewName);
                }

                if (wrapper) wrapper.style.display = 'block';
                if (toolbar) toolbar.style.display = 'flex';
                if (badge) badge.style.display = 'none';

            } else {
                // SINGLE-VIEW CATEGORY (e.g. Cap, Bottle, Phonecase, Mask)
                const viewName = productData.views[0];

                if (index === 0) {
                    // Customizable primary angle
                    if (wrapper) wrapper.style.display = 'block';
                    if (toolbar) toolbar.style.display = 'flex';
                    if (badge) badge.style.display = 'none';

                    // Ensure customizer canvas matches background
                    if (window.customizerImages) {
                        window.customizerImages[viewName] = thumb.dataset.image;
                    }
                    if (typeof window.switchCustomizerView === 'function') {
                        window.switchCustomizerView(viewName);
                    }
                } else {
                    // Secondary non-customizable lifestyle/detail angles
                    if (wrapper) wrapper.style.display = 'none';
                    if (toolbar) toolbar.style.display = 'none';
                    if (badge) {
                        badge.style.display = 'block';
                        badge.textContent = index === 1 ? 'Angled View' : index === 2 ? 'Detail Close-up' : 'Lifestyle Preview';
                    }
                }
            }
        });
    });
}

/**
 * Setup size selection
 */
function setupSizeSelection() {
    const sizeButtons = document.querySelectorAll('.size-btn');

    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

/**
 * Setup color selection
 */
function setupColorSelection() {
    const colorButtons = document.querySelectorAll('.color-btn');

    colorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            colorButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

/**
 * Setup quantity controls
 */
function setupQuantityControls() {
    const qtyInput = document.getElementById('qty-input');
    const decreaseBtn = document.getElementById('qty-decrease');
    const increaseBtn = document.getElementById('qty-increase');
    const totalPriceDisplay = document.getElementById('total-price-display');
    const base = productData.price || 649;

    // Check if JSON has bulkPricing, else use fallback
    let tiers = productData.bulkPricing || [
        { min: 1, max: 5, price: base },
        { min: 6, max: 10, price: Math.round(base * 0.98) },
        { min: 11, max: 20, price: Math.round(base * 0.96) },
        { min: 21, max: 1000, price: Math.round(base * 0.94) }
    ];

    // Populate UI table dynamically
    const tableHeaderRow = document.querySelector('.bulk-table thead tr');
    const tableBodyRow = document.querySelector('.bulk-table tbody tr');

    if (tableHeaderRow && tableBodyRow) {
        tableHeaderRow.innerHTML = '<th>Qty:</th>';
        tableBodyRow.innerHTML = '<td>Price:</td>';

        tiers.forEach((tier, index) => {
            const rangeStr = tier.max === 1000 ? `${tier.min}+` : `${tier.min}-${tier.max}`;
            tableHeaderRow.innerHTML += `<th>${rangeStr}</th>`;
            tableBodyRow.innerHTML += `<td id="price-tier-${index + 1}">₹${tier.price}</td>`;
        });
    }

    function updatePrice() {
        const qty = parseInt(qtyInput.value) || 1;
        
        // Sum up the active print area surcharge (flat ₹50 per extra selected side)
        let surcharge = 0;
        const checkboxes = document.querySelectorAll('.print-area-checkbox');
        checkboxes.forEach(cb => {
            if (cb.checked) surcharge += 50;
        });

        const baseWithSurcharge = base + surcharge;
        let unitPrice = baseWithSurcharge;

        // Dynamic quantity tier discount calculation on top of customizable base price!
        tiers.forEach((tier, index) => {
            const cell = document.getElementById(`price-tier-${index + 1}`);
            if (cell) {
                const discountRatio = tier.price / base;
                const calculatedTierPrice = Math.round(baseWithSurcharge * (discountRatio || 1));
                cell.textContent = `₹${calculatedTierPrice}`;
            }
        });

        for (const tier of tiers) {
            if (qty >= tier.min && qty <= tier.max) {
                const discountRatio = tier.price / base;
                unitPrice = Math.round(baseWithSurcharge * (discountRatio || 1));
                break;
            }
        }

        totalPriceDisplay.textContent = `₹${unitPrice * qty}`;

        // Sync product page main price display
        const mainPriceEl = document.getElementById('current-price');
        if (mainPriceEl) mainPriceEl.textContent = `₹${baseWithSurcharge}`;
    }

    // Export so other components (print checkboxes) can invoke pricing updates
    window.updatePrice = updatePrice;

    decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        if (currentValue > 1) {
            qtyInput.value = currentValue - 1;
            updatePrice();
        }
    });

    increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        if (currentValue < 100) {
            qtyInput.value = currentValue + 1;
            updatePrice();
        }
    });

    qtyInput.addEventListener('input', updatePrice);
    updatePrice(); // Init
}

/**
 * Setup action buttons
 */
function setupActionButtons() {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const buyNowBtn = document.getElementById('buy-now-btn');
    const wishlistBtn = document.getElementById('main-product-wishlist');

    addToCartBtn.addEventListener('click', () => {
        const size = document.querySelector('.size-btn.active')?.dataset.size || 'M';
        const color = document.querySelector('.color-btn.active')?.dataset.color || 'Black';
        const quantity = document.getElementById('qty-input').value;

        alert(`Added to cart!\n\nProduct: ${productData.title}\nSize: ${size}\nColor: ${color}\nQuantity: ${quantity}`);
    });

    buyNowBtn.addEventListener('click', () => {
        const size = document.querySelector('.size-btn.active')?.dataset.size || 'M';
        const color = document.querySelector('.color-btn.active')?.dataset.color || 'Black';
        const quantity = document.getElementById('qty-input').value;

        alert(`Proceeding to checkout...\n\nProduct: ${productData.title}\nSize: ${size}\nColor: ${color}\nQuantity: ${quantity}\nTotal: ₹${productData.price * quantity}`);
    });

    if (wishlistBtn && window.wishlistService) {
        // Init state
        if (window.wishlistService.has(productId)) wishlistBtn.classList.add('active');

        wishlistBtn.addEventListener('click', () => {
            const user = window.authService?.getCurrentUser();
            if (!user) {
                window.dispatchEvent(new CustomEvent('wishlist:require-login'));
                return;
            }

            const isActive = wishlistBtn.classList.contains('active');
            if (isActive) {
                wishlistBtn.classList.remove('active');
                window.wishlistService.remove(productId);
            } else {
                wishlistBtn.classList.add('active');
                window.wishlistService.add(productId);
            }
        });

        // Sync with global updates
        window.addEventListener('wishlist:updated', () => {
            if (window.wishlistService.has(productId)) wishlistBtn.classList.add('active');
            else wishlistBtn.classList.remove('active');
        });
    }
}

/**
 * Setup tabs
 */
function setupTabs() {
    const tabHeaders = document.querySelectorAll('.tab-header');
    const tabContents = document.querySelectorAll('.tab-content');

    tabHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const tabName = header.dataset.tab;

            // Update headers
            tabHeaders.forEach(h => h.classList.remove('active'));
            header.classList.add('active');

            // Update contents
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabName}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

/**
 * Load reviews
 */
function loadReviews() {
    const reviewsList = document.getElementById('reviews-list');

    reviewsList.innerHTML = reviewsData.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">${review.name.charAt(0)}</div>
                    <div>
                        <div class="reviewer-name">${review.name}</div>
                        <div class="review-date">${review.date}</div>
                    </div>
                </div>
                <div class="review-rating">
                    ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                </div>
            </div>
            <div class="review-text">${review.text}</div>
        </div>
    `).join('');
}

/**
 * Helper to make a floating panel draggable within its parent container
 */
function makeElementDraggable(elmnt, dragHandle) {
    let initialMouseX = 0, initialMouseY = 0;
    let initialElementTop = 0, initialElementLeft = 0;
    
    if (dragHandle) {
        dragHandle.style.cursor = 'move';
        dragHandle.onmousedown = dragMouseDown;
        dragHandle.ontouchstart = dragTouchStart;
    } else {
        elmnt.style.cursor = 'move';
        elmnt.onmousedown = dragMouseDown;
        elmnt.ontouchstart = dragTouchStart;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        if (e.button !== 0) return; // Only left mouse button drag
        e.preventDefault();
        
        initialMouseX = e.clientX;
        initialMouseY = e.clientY;
        initialElementTop = elmnt.offsetTop;
        initialElementLeft = elmnt.offsetLeft;
        
        document.addEventListener('mousemove', elementDrag);
        document.addEventListener('mouseup', closeDragElement);
    }

    function dragTouchStart(e) {
        e = e || window.event;
        const touch = e.touches[0];
        
        initialMouseX = touch.clientX;
        initialMouseY = touch.clientY;
        initialElementTop = elmnt.offsetTop;
        initialElementLeft = elmnt.offsetLeft;
        
        document.addEventListener('touchmove', elementTouchDrag, { passive: false });
        document.addEventListener('touchend', closeDragElement);
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        
        const deltaX = e.clientX - initialMouseX;
        const deltaY = e.clientY - initialMouseY;
        
        updateElementPosition(initialElementTop + deltaY, initialElementLeft + deltaX);
    }

    function elementTouchDrag(e) {
        e = e || window.event;
        e.preventDefault(); // Prevents page scrolling while dragging the panel!
        const touch = e.touches[0];
        
        const deltaX = touch.clientX - initialMouseX;
        const deltaY = touch.clientY - initialMouseY;

        updateElementPosition(initialElementTop + deltaY, initialElementLeft + deltaX);
    }

    function updateElementPosition(top, left) {
        const container = elmnt.offsetParent;
        if (!container) return;

        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const elementWidth = elmnt.clientWidth;
        const elementHeight = elmnt.clientHeight;

        // Keep it safely constrained within container bounds
        let newTop = Math.max(0, Math.min(top, containerHeight - elementHeight));
        let newLeft = Math.max(0, Math.min(left, containerWidth - elementWidth));

        elmnt.style.top = newTop + "px";
        elmnt.style.left = newLeft + "px";
        elmnt.style.bottom = "auto";
        elmnt.style.right = "auto";
        elmnt.style.transform = 'none';
    }

    function closeDragElement() {
        document.removeEventListener('mousemove', elementDrag);
        document.removeEventListener('mouseup', closeDragElement);
        document.removeEventListener('touchmove', elementTouchDrag);
        document.removeEventListener('touchend', closeDragElement);
    }
}

/**
 * Setup Fabric.js Customizer
 */
function setupCustomizer() {
    const canvasEl = document.getElementById('product-canvas');
    const wrapper = document.querySelector('.canvas-wrapper');
    const mainImage = document.getElementById('main-product-image');

    if (!canvasEl || !wrapper || !mainImage) return;

    // Make wrapper interactive
    wrapper.classList.add('active');
    document.querySelector('.safe-zone-indicator').style.display = 'flex';

    // Base dimensions on the main image
    const width = mainImage.clientWidth;
    const height = mainImage.clientHeight;

    // Expand the Fabric canvas print area to align perfectly with the 80% green Safe Zone boundaries
    const printWidth = width * 0.8;
    const printHeight = height * 0.8;

    const canvas = new fabric.Canvas('product-canvas', {
        width: printWidth,
        height: printHeight,
        preserveObjectStacking: true
    });

    // Style the canvas container to blend seamlessly with the green safe zone box
    const container = document.querySelector('.canvas-container');
    if (container) {
        container.style.border = 'none'; // Avoid double borders, the green safe zone indicator is our clean boundary!
        container.style.boxShadow = 'none'; // Remove washed background overlay to keep concrete mockup backdrop fully clean!
    }

    // --- Multi-View Logic ---
    let currentView = 'front';
    const canvasStates = {};
    
    // Initialize canvasStates dynamically for all views in productData.views
    if (productData.views) {
        productData.views.forEach(view => {
            canvasStates[view] = null;
        });
        currentView = productData.views[0];
    } else {
        productData.views = ['front'];
        canvasStates['front'] = null;
    }

    // Set up window.customizerImages dynamically using resolved category views
    window.customizerImages = {};
    productData.views.forEach((view, idx) => {
        window.customizerImages[view] = productData.images[idx] || (productData.viewPlaceholders && productData.viewPlaceholders[view]);
    });

    const printSidesHeader = document.getElementById('print-sides-header');
    const viewSwitcherTabs = document.getElementById('view-switcher-tabs');
    const printAreasContainer = document.getElementById('print-areas-container');

    // Populate Print Area Checkboxes dynamically!
    if (printAreasContainer && productData.views) {
        if (productData.views.length > 1) {
            if (printSidesHeader) printSidesHeader.style.display = 'block';
            printAreasContainer.innerHTML = productData.views.map((view, idx) => {
                let displayName = view.replace('_', ' ').toUpperCase();
                if (displayName === 'LEFT SLEEVE') displayName = 'L-SLEEVE';
                if (displayName === 'RIGHT SLEEVE') displayName = 'R-SLEEVE';
                
                if (idx === 0) {
                    return `
                        <label style="display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 500; cursor: pointer;">
                            <input type="checkbox" id="side-${view}-cb" checked disabled style="width: 16px; height: 16px; accent-color: #000;">
                            ${displayName} (Included)
                        </label>
                    `;
                }
                
                // Flat premium ₹50 surcharge per additional location
                let priceText = "+₹50";
                
                return `
                    <label style="display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 500; cursor: pointer;">
                        <input type="checkbox" id="side-${view}-cb" class="print-area-checkbox" data-view="${view}" style="width: 16px; height: 16px; accent-color: #000;">
                        ${displayName} (${priceText})
                    </label>
                `;
            }).join('');
        } else {
            if (printSidesHeader) printSidesHeader.style.display = 'none';
        }
    }

    // Build Switcher Tab Buttons dynamically!
    if (viewSwitcherTabs && productData.views) {
        if (productData.views.length > 1) {
            viewSwitcherTabs.style.setProperty('display', 'flex', 'important');
            
            viewSwitcherTabs.innerHTML = productData.views.map((view, idx) => {
                let displayName = view.replace('_', ' ').toUpperCase();
                if (displayName === 'LEFT SLEEVE') {
                    displayName = window.innerWidth < 768 ? 'L-SLV' : 'L-SLEEVE';
                }
                if (displayName === 'RIGHT SLEEVE') {
                    displayName = window.innerWidth < 768 ? 'R-SLV' : 'R-SLEEVE';
                }
                const isActive = view === currentView;
                return `<button class="view-tab ${isActive ? 'active' : ''}" data-view="${view}">${displayName}</button>`;
            }).join('');
        } else {
            viewSwitcherTabs.style.setProperty('display', 'none', 'important');
            viewSwitcherTabs.innerHTML = ''; // Wipe out hardcoded T-shirt buttons for single-view categories!
        }
    }

    function calculateDynamicPrice() {
        if (typeof window.updatePrice === 'function') {
            window.updatePrice();
        }
    }

    // Setup print-area-checkbox listeners to show/hide dynamic view tabs
    const checkboxes = document.querySelectorAll('.print-area-checkbox');
    checkboxes.forEach(cb => {
        const view = cb.dataset.view;
        const tab = document.querySelector(`.view-tab[data-view="${view}"]`);
        
        // Hide optional views' switcher tabs initially
        if (tab) {
            tab.style.display = 'none';
        }
        
        cb.addEventListener('change', (e) => {
            if (tab) {
                tab.style.display = e.target.checked ? 'block' : 'none';
                if (!e.target.checked && currentView === view) {
                    switchView(productData.views[0]);
                }
            }
            calculateDynamicPrice();
        });
    });

    // Switch View function
    function switchView(viewName) {
        // Save current state
        canvasStates[currentView] = JSON.stringify(canvas.toJSON());

        currentView = viewName;

        // Update tabs active state
        const viewTabs = document.querySelectorAll('.view-tab');
        viewTabs.forEach(tab => {
            const isTabActive = tab.dataset.view === viewName;
            tab.classList.toggle('active', isTabActive);
        });

        // Swap Image dynamically
        const viewSrc = window.customizerImages[viewName];
        if (viewSrc) {
            mainImage.crossOrigin = 'anonymous';
            mainImage.src = getCorsProxyUrl(viewSrc);
        }

        // Sync main thumbnail active state as well
        document.querySelectorAll('.thumbnail').forEach(thumb => {
            const index = parseInt(thumb.dataset.index, 10);
            const thumbView = productData.views[index];
            thumb.classList.toggle('active', thumbView === viewName);
        });

        // Load new state
        canvas.clear();
        if (canvasStates[viewName]) {
            canvas.loadFromJSON(canvasStates[viewName], canvas.renderAll.bind(canvas));
        }
    }

    // Export switchView globally so setupImageGallery can call it
    window.switchCustomizerView = switchView;

    // Attach Click listeners to all viewTabs
    const viewTabs = document.querySelectorAll('.view-tab');
    viewTabs.forEach(tab => {
        tab.addEventListener('click', () => switchView(tab.dataset.view));
    });

    function generateUniqueId() {
        return 'id_' + Math.random().toString(36).substr(2, 9);
    }

    const resumeId = urlParams.get('resume');
    if (resumeId) {
        let savedDesigns = [];
        try {
            savedDesigns = JSON.parse(localStorage.getItem('my_custom_designs') || '[]');
        } catch(e){}
        const designToResume = savedDesigns.find(d => d.id === resumeId);
        if (designToResume && designToResume.state) {
            async function decompressData(dataStr) {
                try {
                    if (typeof DecompressionStream !== 'undefined' && dataStr.startsWith('data:')) {
                        const res = await fetch(dataStr);
                        const blob = await res.blob();
                        const ds = new DecompressionStream('gzip');
                        const decompressedStream = blob.stream().pipeThrough(ds);
                        const outRes = new Response(decompressedStream);
                        const text = await outRes.text();
                        return JSON.parse(text);
                    }
                } catch(e) { console.error("DecompressionStream error:", e); }
                try {
                    return JSON.parse(decodeURIComponent(escape(atob(dataStr))));
                } catch(e) { console.error("Base64 decode error:", e); return null; }
            }
            
            decompressData(designToResume.state).then(states => {
                if (states) {
                    for (const v in states) {
                        canvasStates[v] = states[v];
                    }
                    if (canvasStates[currentView]) {
                        canvas.loadFromJSON(canvasStates[currentView], canvas.renderAll.bind(canvas));
                    }
                }
            }).catch(e => console.error("Resume load error:", e));
        }
    }

    // --- Tools Setup ---
    document.getElementById('tool-add-text').addEventListener('click', () => {
        const text = new fabric.IText('Your Text', {
            left: 50,
            top: 50,
            fontFamily: 'Inter',
            fontSize: 24,
            fill: '#000000',
            id: generateUniqueId()
        });
        canvas.add(text);
        canvas.setActiveObject(text);
    });

    // --- Add Image Modal Logic ---
    const imageModal = document.getElementById('add-image-modal');

    document.getElementById('tool-add-image').addEventListener('click', () => {
        imageModal.classList.add('active');
    });

    document.getElementById('close-image-modal').addEventListener('click', () => {
        imageModal.classList.remove('active');
    });

    // Close on outside click
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) imageModal.classList.remove('active');
    });

    // Modal Tabs
    const imgTabs = document.querySelectorAll('.img-tab');
    const imgTabContents = document.querySelectorAll('.img-tab-content');
    imgTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            imgTabs.forEach(t => t.classList.remove('active'));
            imgTabContents.forEach(c => c.style.display = 'none');

            tab.classList.add('active');
            const target = document.getElementById(`tab-${tab.dataset.tab}`);
            if (target) {
                target.style.display = 'block';

                // Lazy load designs if clicked
                if (tab.dataset.tab === 'designs' && document.getElementById('designs-grid').children.length === 0) {
                    loadMockDesigns();
                }
            }
        });
    });

    // Device Upload Trigger inside Modal
    document.getElementById('trigger-file-upload').addEventListener('click', () => {
        document.getElementById('custom-image-upload').click();
    });

    document.getElementById('custom-image-upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (f) => {
            const imgEl = new Image();
            imgEl.onload = () => {
                const tempCv = document.createElement('canvas');
                tempCv.width = imgEl.width;
                tempCv.height = imgEl.height;
                tempCv.getContext('2d').drawImage(imgEl, 0, 0);
                const compressedDataUrl = tempCv.toDataURL('image/webp', 0.6); // Very compressed webp
                
                // Save to local cache 'uploads' simulating a folder
                let localUploads = JSON.parse(localStorage.getItem('user_uploads') || '{}');
                const imgId = generateUniqueId();
                localUploads[imgId] = compressedDataUrl;
                localStorage.setItem('user_uploads', JSON.stringify(localUploads));

                fabric.Image.fromURL(compressedDataUrl, (img) => {
                    img.scaleToWidth(printWidth * 0.5); // Scale to 50% of print area
                    img.id = imgId;
                    canvas.add(img);
                    canvas.centerObject(img);
                    canvas.setActiveObject(img);
                    imageModal.classList.remove('active'); // Close modal on add
                });
            };
            imgEl.src = f.target.result;
        };
        reader.readAsDataURL(file);
    });

    // URL Image Upload inside Modal
    const btnAddUrlImage = document.getElementById('btn-add-url-image');
    if (btnAddUrlImage) {
        btnAddUrlImage.addEventListener('click', () => {
            const url = document.getElementById('custom-image-url-input').value.trim();
            if (!url) {
                alert("Please paste a valid image URL.");
                return;
            }
            fabric.Image.fromURL(url, (img) => {
                if (!img) {
                    alert("Failed to load image from URL. Please ensure it's a valid direct image link.");
                    return;
                }
                img.scaleToWidth(printWidth * 0.5);
                img.id = generateUniqueId();
                canvas.add(img);
                canvas.centerObject(img);
                canvas.setActiveObject(img);
                imageModal.classList.remove('active');
                document.getElementById('custom-image-url-input').value = '';
            }, { crossOrigin: 'anonymous' });
        });
    }

    function loadMockDesigns(category = 'all') {
        const grid = document.getElementById('designs-grid');

        const categories = {
            'all': ['😀', '😎', '❤️', '✨', '🔥', '🎉', '🎈', '👑', '⭐', '💯', '💪', '🌟', '⚽', '🏀', '🎸', '🎵', '🍕', '🍔', '🍩', '☕'],
            'animals': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🦁', '🐮', '🐷', '🐸'],
            'birthday': ['🎂', '🎈', '🎉', '🎁', '🥳', '🎊', '🕯️', '🍰'],
            'catchwords': ['WOW', 'OMG', 'SALE', 'NEW', 'HOT', 'YAY', 'COOL', 'WIN'],
            'emoji': ['😀', '😎', '😂', '😍', '🤔', '😴', '😎', '🤓', '😇', '🤠']
        };

        const itemsToLoad = categories[category.toLowerCase()] || categories['all'];

        grid.innerHTML = itemsToLoad.map(e => `<div class="design-item">${e}</div>`).join('');

        // Add to canvas on click
        grid.querySelectorAll('.design-item').forEach(item => {
            item.addEventListener('click', () => {
                const text = new fabric.IText(item.textContent, {
                    left: 50,
                    top: 50,
                    fontSize: 64,
                    fontFamily: 'Inter',
                    id: generateUniqueId()
                });
                canvas.add(text);
                canvas.centerObject(text);
                canvas.setActiveObject(text);
                imageModal.classList.remove('active');
            });
        });
    }

    // Attach click listeners to design category pills
    document.querySelectorAll('.cat-pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
            document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
            e.target.classList.add('active');
            loadMockDesigns(e.target.textContent.trim().toLowerCase());
        });
    });

    // Action Bar - WhatsApp
    const waBtn = document.getElementById('btn-whatsapp-action');
    if (waBtn) {
        waBtn.addEventListener('click', () => {
            const currentTitle = document.getElementById('product-title')?.textContent || 'SnapPrint Product';
            const shareUrl = window.location.href;
            const message = `Check out this amazing personalized product on SnapPrint: ${currentTitle} - ${shareUrl}`;
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
        });
    }

    // Helper to generate a composited high-resolution image for a specific view
    async function generateCompositedImage(viewName) {
        // Save current canvas state first if switching views
        if (viewName === currentView) {
            canvasStates[currentView] = JSON.stringify(canvas.toJSON());
        }

        return new Promise(async (resolve) => {
            try {
                const currentJSON = JSON.stringify(canvas.toJSON());
                const savedView = currentView;

                // Deselect active object to avoid drawing handles
                canvas.discardActiveObject();
                canvas.renderAll();

                const mainImg = document.getElementById('main-product-image');
                const customizerContainer = document.getElementById('customizer-container');

                if (!mainImg || !customizerContainer) {
                    resolve(canvas.toDataURL({ format: 'png', quality: 1 }));
                    return;
                }

                // Swap mockup background image source temporarily
                const originalSrc = mainImg.src;
                const targetSrc = window.customizerImages[viewName] || originalSrc;
                mainImg.crossOrigin = 'anonymous';
                mainImg.src = getCorsProxyUrl(targetSrc);

                // Wait for the background image to fully load
                await new Promise((res) => {
                    if (mainImg.complete) res();
                    else {
                        mainImg.onload = res;
                        mainImg.onerror = res;
                    }
                });

                // Load Fabric canvas state of the target view temporarily
                const targetJSON = canvasStates[viewName] || '{"objects":[],"background":""}';
                canvas.clear();
                
                await new Promise((res) => {
                    canvas.loadFromJSON(targetJSON, () => {
                        canvas.renderAll();
                        res();
                    });
                });

                // Setup offscreen compositing canvas
                const rect = customizerContainer.getBoundingClientRect();
                const imgRect = mainImg.getBoundingClientRect();

                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = rect.width;
                tempCanvas.height = rect.height;
                const ctx = tempCanvas.getContext('2d');

                const imgLeft = imgRect.left - rect.left;
                const imgTop = imgRect.top - rect.top;

                ctx.drawImage(mainImg, imgLeft, imgTop, imgRect.width, imgRect.height);

                const fabricCanvasEl = canvas.lowerCanvasEl;
                const fabricDataUrl = canvas.toDataURL({ format: 'png', quality: 1 });

                const fabricImg = new Image();
                fabricImg.crossOrigin = "anonymous";
                fabricImg.onload = () => {
                    try {
                        const canvasRect = fabricCanvasEl.getBoundingClientRect();
                        const top = canvasRect.top - rect.top;
                        const left = canvasRect.left - rect.left;

                        ctx.drawImage(fabricImg, left, top, canvasRect.width, canvasRect.height);
                        
                        // Restore original state completely
                        mainImg.src = originalSrc;
                        canvas.clear();
                        canvas.loadFromJSON(currentJSON, () => {
                            canvas.renderAll();
                            resolve(tempCanvas.toDataURL('image/png'));
                        });
                    } catch (e) {
                        mainImg.src = originalSrc;
                        canvas.clear();
                        canvas.loadFromJSON(currentJSON, () => {
                            canvas.renderAll();
                            resolve(canvas.toDataURL({ format: 'png', quality: 1 }));
                        });
                    }
                };
                fabricImg.onerror = () => {
                    mainImg.src = originalSrc;
                    canvas.clear();
                    canvas.loadFromJSON(currentJSON, () => {
                        canvas.renderAll();
                        resolve(canvas.toDataURL({ format: 'png', quality: 1 }));
                    });
                };
                fabricImg.src = fabricDataUrl;

            } catch (err) {
                console.warn("Compositing target view failed", viewName, err);
                resolve(canvas.toDataURL({ format: 'png', quality: 1 }));
            }
        });
    }

    // Action Bar - Download (Supports Single-View Image & Multi-View ZIP Bundling!)
    const downloadBtn = document.getElementById('btn-download-design');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', async () => {
            // Find all active print views
            const activeViews = [productData.views[0]]; // Primary view is always included
            const printCheckboxes = document.querySelectorAll('.print-area-checkbox');
            printCheckboxes.forEach(cb => {
                if (cb.checked) {
                    activeViews.push(cb.dataset.view);
                }
            });

            if (activeViews.length > 1) {
                // MULTI-VIEW BUNDLING: Download as a high-quality ZIP!
                
                // 1. Create a premium full-screen blur loader overlay
                const loader = document.createElement('div');
                loader.style = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.8); color: #fff; z-index: 99999; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; gap: 16px; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); transition: all 0.3s ease;";
                loader.innerHTML = `
                    <div style="width: 50px; height: 50px; border: 5px solid rgba(255,255,255,0.2); border-top: 5px solid #fff; border-radius: 50%; animation: zip-spin 1s linear infinite;"></div>
                    <div style="font-size: 18px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">Compositing Print Designs</div>
                    <div id="zip-status-text" style="font-size: 13px; opacity: 0.7; color: #a1a1aa; font-weight: 500;">Resolving zip packages...</div>
                    <style>
                        @keyframes zip-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    </style>
                `;
                document.body.appendChild(loader);

                try {
                    // 2. Load JSZip dynamically from cdnjs if not already loaded
                    if (typeof JSZip === 'undefined') {
                        const script = document.createElement('script');
                        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
                        document.head.appendChild(script);
                        await new Promise((resolve) => script.onload = resolve);
                    }

                    const zip = new JSZip();

                    // 3. Composite and capture each active view
                    for (const view of activeViews) {
                        const statusEl = document.getElementById('zip-status-text');
                        if (statusEl) {
                            statusEl.textContent = `Processing view: ${view.replace('_', ' ').toUpperCase()}...`;
                        }
                        const dataUrl = await generateCompositedImage(view);
                        const base64Data = dataUrl.split(',')[1];
                        const filename = `${productData.category || 'product'}-${view}-design.png`;
                        zip.file(filename, base64Data, { base64: true });
                    }

                    // 4. Generate the ZIP blob and download it
                    const statusEl = document.getElementById('zip-status-text');
                    if (statusEl) {
                        statusEl.textContent = "Compiling ZIP Archive...";
                    }
                    const content = await zip.generateAsync({ type: 'blob' });
                    
                    const link = document.createElement('a');
                    link.download = `${productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-designs.zip`;
                    link.href = URL.createObjectURL(content);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                } catch (err) {
                    console.error("Multi-view zip compilation failed:", err);
                    alert("ZIP compiling failed. Downloading current active view as fallback.");
                    // Fallback to active view download
                    const dataUrl = await generateCompositedImage(currentView);
                    const link = document.createElement('a');
                    link.download = 'my-snapprint-design-fallback.png';
                    link.href = dataUrl;
                    link.click();
                } finally {
                    // Remove loader
                    document.body.removeChild(loader);
                }

            } else {
                // SINGLE-VIEW: Download just the active Front view
                const dataUrl = await generateCompositedImage(currentView);
                const link = document.createElement('a');
                link.download = `${productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${currentView}-design.png`;
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
    }

    // Action Bar - Copy Design (Copies ONLY the current active view design progress!)
    const copyBtn = document.getElementById('btn-copy-design');
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            const finalDataUrl = await generateCompositedImage(currentView);
            try {
                const response = await fetch(finalDataUrl);
                const blob = await response.blob();
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
                alert("Current view design copied to clipboard successfully!");
            } catch (err) {
                console.error("Failed to copy image to clipboard:", err);
                alert("Clipboard copy failed. Please right click the preview or try manually.");
            }
        });
    }

    // Keyboard Shortcuts (Ctrl+V Paste listener for images)
    window.addEventListener('paste', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                const reader = new FileReader();
                reader.onload = (event) => {
                    fabric.Image.fromURL(event.target.result, (img) => {
                        img.scaleToWidth(printWidth * 0.5);
                        canvas.add(img);
                        canvas.centerObject(img);
                        canvas.setActiveObject(img);
                        canvas.renderAll();
                    });
                };
                reader.readAsDataURL(blob);
                e.preventDefault();
                break;
            }
        }
    });

    // Action Bar - Zoom
    const zoomBtn = document.getElementById('btn-zoom-design');
    if (zoomBtn) {
        let isZoomed = false;
        let zoomLevel = 1;
        const wrapper = document.querySelector('.canvas-wrapper');
        const actionBar = document.querySelector('.floating-action-bar');

        if (wrapper) {
            // Mouse wheel listener
            wrapper.addEventListener('wheel', (e) => {
                if (!isZoomed) return;
                e.preventDefault();
                if (e.deltaY < 0) {
                    zoomLevel = Math.min(3, zoomLevel + 0.1);
                } else {
                    zoomLevel = Math.max(1, zoomLevel - 0.1);
                }
                wrapper.style.transform = `scale(${zoomLevel})`;
                wrapper.style.cursor = zoomLevel > 1 ? 'zoom-out' : 'zoom-in';
            }, { passive: false });
        }

        zoomBtn.addEventListener('click', () => {
            isZoomed = !isZoomed;
            if (isZoomed) {
                zoomLevel = 1.4;
                wrapper.style.transform = `scale(${zoomLevel})`;
                wrapper.style.zIndex = '100';
                wrapper.style.cursor = 'zoom-in';
                zoomBtn.style.color = '#2563eb';
                zoomBtn.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <polyline points="9 21 3 21 3 15"></polyline>
                        <line x1="21" y1="3" x2="14" y2="10"></line>
                        <line x1="3" y1="21" x2="10" y2="14"></line>
                    </svg>
                    Zoom Mode
                `;
                if (actionBar) actionBar.style.zIndex = '105'; // Keep action bar above zoom
            } else {
                zoomLevel = 1;
                wrapper.style.transform = 'scale(1)';
                wrapper.style.zIndex = '1';
                wrapper.style.cursor = 'default';
                zoomBtn.style.color = 'inherit';
                zoomBtn.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        <line x1="11" y1="8" x2="11" y2="14"></line>
                        <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                    Zoom
                `;
                if (actionBar) actionBar.style.zIndex = '10';
            }
        });
    }

    async function compressData(data) {
        try {
            if (typeof CompressionStream !== 'undefined') {
                const stream = new Blob([JSON.stringify(data)], { type: 'application/json' }).stream();
                const compressedReadableStream = stream.pipeThrough(new CompressionStream('gzip'));
                const compressedResponse = new Response(compressedReadableStream);
                const blob = await compressedResponse.blob();
                return new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });
            }
        } catch(e) {}
        return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    }

    function showToast(message, type = 'success') {
        const toastId = 'toast-container-notification';
        let container = document.getElementById(toastId);
        if (!container) {
            container = document.createElement('div');
            container.id = toastId;
            container.style.cssText = 'position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 999999; display: flex; flex-direction: column; gap: 12px; pointer-events: none; width: 90%; max-width: 400px;';
            document.body.appendChild(container);
        }
        
        const toast = document.createElement('div');
        toast.style.cssText = `background: rgba(17, 17, 17, 0.95); color: #fff; border-radius: 12px; font-family: Inter, sans-serif; font-size: 14px; font-weight: 500; box-shadow: 0 10px 30px -5px rgba(0,0,0,0.4); opacity: 0; transform: translateY(30px) scale(0.95); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); display: flex; flex-direction: column; overflow: hidden; backdrop-filter: blur(10px);`;
        
        const content = document.createElement('div');
        content.style.cssText = 'padding: 14px 20px; display: flex; align-items: center; gap: 12px;';
        
        const iconColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#fff';
        const icon = document.createElement('span');
        icon.innerHTML = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
        icon.style.cssText = `background: ${iconColor}; color: ${type === 'info' ? '#111' : '#fff'}; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: bold; font-size: 13px; flex-shrink: 0; box-shadow: 0 2px 8px ${iconColor}40;`;
        
        content.appendChild(icon);
        content.appendChild(document.createTextNode(message));
        toast.appendChild(content);

        const progressBarContainer = document.createElement('div');
        progressBarContainer.style.cssText = 'width: 100%; height: 3px; background: rgba(255,255,255,0.1);';
        
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `width: 100%; height: 100%; background: ${iconColor}; transform-origin: left; transition: transform 3.5s linear;`;
        progressBarContainer.appendChild(progressBar);
        
        toast.appendChild(progressBarContainer);
        container.appendChild(toast);
        
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0) scale(1)';
            requestAnimationFrame(() => {
                progressBar.style.transform = 'scaleX(0)';
            });
        });
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px) scale(0.95)';
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }

    // Action Bar - Wishlist (Mock Saving Custom Design)
    const wishlistBtn = document.getElementById('main-product-wishlist');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', async () => {
            wishlistBtn.style.color = '#ef4444';
            
            // Call standard wishlist
            if (window.wishlistService && !window.wishlistService.has(productId)) {
                window.wishlistService.add(productId);
            }
            
            // Save current progress
            canvasStates[currentView] = JSON.stringify(canvas.toJSON());
            
            let hasProgress = false;
            for (const view in canvasStates) {
                if (canvasStates[view]) {
                    const state = JSON.parse(canvasStates[view]);
                    if (state.objects && state.objects.length > 0) {
                        hasProgress = true;
                        break;
                    }
                }
            }

            if (hasProgress) {
                showToast("Saving custom design...", "info");
                // Get webp preview with progressed thing
                const pngDataUrl = await generateCompositedImage(currentView);
                const img = new Image();
                img.onload = async () => {
                    const tempCv = document.createElement('canvas');
                    tempCv.width = img.width / 2; // Resize to lower storage
                    tempCv.height = img.height / 2;
                    tempCv.getContext('2d').drawImage(img, 0, 0, tempCv.width, tempCv.height);
                    const webpPreview = tempCv.toDataURL('image/webp', 0.5);

                    const targetId = resumeId || ('design_' + Math.random().toString(36).substr(2, 9));

                    const designData = {
                        id: targetId,
                        productId: productId,
                        title: productData.title,
                        preview: webpPreview,
                        state: await compressData(canvasStates),
                        expiry: Date.now() + (3 * 24 * 60 * 60 * 1000) // 3 days
                    };
                    
                    let savedDesigns = JSON.parse(localStorage.getItem('my_custom_designs') || '[]');
                    const existingIndex = savedDesigns.findIndex(d => d.id === targetId);
                    if (existingIndex > -1) {
                        savedDesigns[existingIndex] = designData;
                    } else {
                        savedDesigns.push(designData);
                    }
                    localStorage.setItem('my_custom_designs', JSON.stringify(savedDesigns));
                    
                    showToast("Custom design progress saved to 'My Designs'!");
                };
                img.src = pngDataUrl;
            } else {
                showToast("Product saved to your wishlist!");
            }
        });
    }

    // --- QR Code Generator Logic ---
    const btnGenerateQr = document.getElementById('btn-generate-qr');
    if (btnGenerateQr) {
        btnGenerateQr.addEventListener('click', () => {
            const content = document.getElementById('qr-content').value;
            if (!content) {
                alert("Please enter content for the QR code.");
                return;
            }
            const color = document.getElementById('qr-color').value.replace('#', '');
            const bg = document.getElementById('qr-bg').value.replace('#', '');

            // Using a free QR code API
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(content)}&color=${color}&bgcolor=${bg}`;

            btnGenerateQr.textContent = "Generating...";
            fabric.Image.fromURL(qrUrl, (img) => {
                img.scaleToWidth(100);
                canvas.add(img);
                canvas.centerObject(img);
                canvas.setActiveObject(img);
                imageModal.classList.remove('active');
                btnGenerateQr.textContent = "Generate QR code";
            }, { crossOrigin: 'anonymous' });
        });
    }

    // --- Web Search Logic (Mock) ---
    const btnWebSearch = document.getElementById('btn-web-search');
    const searchInput = document.getElementById('web-search-input');
    const searchGrid = document.getElementById('search-results-grid');

    if (btnWebSearch) {
        btnWebSearch.addEventListener('click', async () => {
            const query = searchInput.value.trim();
            if (!query) return;

            searchGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center;">Searching...</div>';

            try {
                // Use Wikimedia Commons API for real image search
                const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=12&pithumbsize=400&origin=*`;
                const response = await fetch(apiUrl);
                const data = await response.json();

                let html = '';
                if (data.query && data.query.pages) {
                    const pages = Object.values(data.query.pages);
                    pages.forEach(page => {
                        if (page.thumbnail && page.thumbnail.source) {
                            html += `<div class="design-item" style="padding:0; overflow:hidden;">
                                        <img src="${page.thumbnail.source}" style="width:100%; height:100%; object-fit:cover;" crossorigin="anonymous">
                                     </div>`;
                        }
                    });
                }

                if (!html) {
                    html = '<div style="grid-column: 1/-1; text-align:center;">No results found.</div>';
                }
                searchGrid.innerHTML = html;

                searchGrid.querySelectorAll('.design-item img').forEach(imgEl => {
                    imgEl.addEventListener('click', (e) => {
                        const url = e.target.src;
                        fabric.Image.fromURL(url, (img) => {
                            img.scaleToWidth(150);
                            canvas.add(img);
                            canvas.centerObject(img);
                            canvas.setActiveObject(img);
                            imageModal.classList.remove('active');
                        }, { crossOrigin: 'anonymous' });
                    });
                });
            } catch (err) {
                console.error("Search error", err);
                searchGrid.innerHTML = '<div style="grid-column: 1/-1; text-align:center;">Error fetching images.</div>';
            }
        });
    }

    // --- Drawing Logic ---
    let drawingCanvas;
    const tabDrawingBtn = document.querySelector('[data-tab="drawing"]');
    if (tabDrawingBtn) {
        tabDrawingBtn.addEventListener('click', () => {
            if (!drawingCanvas) {
                // Initialize secondary canvas only when tab is opened
                drawingCanvas = new fabric.Canvas('drawing-modal-canvas', {
                    isDrawingMode: true,
                    width: 600,
                    height: 300
                });
                // Sync properties
                drawingCanvas.freeDrawingBrush.color = document.getElementById('drawing-color').value;
                drawingCanvas.freeDrawingBrush.width = parseInt(document.getElementById('drawing-size').value, 10);
            }
        });
    }

    document.getElementById('drawing-color').addEventListener('change', (e) => {
        if (drawingCanvas) drawingCanvas.freeDrawingBrush.color = e.target.value;
    });

    document.getElementById('drawing-size').addEventListener('change', (e) => {
        if (drawingCanvas) drawingCanvas.freeDrawingBrush.width = parseInt(e.target.value, 10);
    });

    document.getElementById('btn-clear-drawing').addEventListener('click', () => {
        if (drawingCanvas) drawingCanvas.clear();
    });

    document.getElementById('btn-add-drawing').addEventListener('click', () => {
        if (!drawingCanvas || drawingCanvas.getObjects().length === 0) {
            alert("Please draw something first!");
            return;
        }

        // Export drawing to image and add to main canvas
        const dataUrl = drawingCanvas.toDataURL('png');
        fabric.Image.fromURL(dataUrl, (img) => {
            // Trim empty space (optional advanced feature, skipping for now)
            img.scaleToWidth(200);
            canvas.add(img);
            canvas.centerObject(img);
            canvas.setActiveObject(img);
            imageModal.classList.remove('active');
        });
    });

    document.getElementById('tool-delete').addEventListener('click', () => {
        const active = canvas.getActiveObject();
        if (active) {
            canvas.remove(active);
            canvas.discardActiveObject();
        }
    });

    // --- Properties Panel Setup ---
    const propsBox = document.getElementById('properties-box');
    const textControls = document.getElementById('prop-text-controls');
    const imgControls = document.getElementById('prop-image-controls');

    const textInput = document.getElementById('prop-text-input');
    const fontSelect = document.getElementById('prop-font-select');
    const colorInput = document.getElementById('prop-color-input');
    const opacitySlider = document.getElementById('prop-opacity-slider');

    // Drag dragging panel trigger
    const propHeader = propsBox.querySelector('.prop-header');
    if (propsBox && propHeader) {
        makeElementDraggable(propsBox, propHeader);
    }

    // Dismiss active object on close click
    const closePropsBtn = document.getElementById('tool-close-props');
    if (closePropsBtn) {
        closePropsBtn.addEventListener('click', () => {
            canvas.discardActiveObject();
            canvas.renderAll();
        });
    }

    canvas.on('selection:created', updateProps);
    canvas.on('selection:updated', updateProps);
    canvas.on('selection:cleared', () => {
        propsBox.style.display = 'none';
    });

    function updateProps() {
        const active = canvas.getActiveObject();
        if (!active) return;

        propsBox.style.display = 'block';

        // Set high-end responsive starting position on first select
        if (propsBox.dataset.hasBeenPositioned !== "true") {
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                propsBox.style.top = "70px";
                propsBox.style.left = "10px";
                propsBox.style.bottom = "auto";
                propsBox.style.right = "auto";
                propsBox.style.width = "calc(100% - 20px)";
            } else {
                propsBox.style.top = "80px";
                propsBox.style.left = "20px";
                propsBox.style.bottom = "auto";
                propsBox.style.right = "auto";
                propsBox.style.width = "280px";
            }
            propsBox.dataset.hasBeenPositioned = "true";
        }

        if (active.type === 'i-text') {
            textControls.style.display = 'block';
            imgControls.style.display = 'none';
            textInput.value = active.text;
            fontSelect.value = active.fontFamily;
            colorInput.value = active.fill;

            // Advanced Text States
            document.getElementById('prop-bold').style.background = active.fontWeight === 'bold' ? '#e2e8f0' : '';
            document.getElementById('prop-italic').style.background = active.fontStyle === 'italic' ? '#e2e8f0' : '';
            document.getElementById('prop-shadow').checked = !!active.shadow;
            document.getElementById('prop-outline').checked = active.stroke ? true : false;
        } else {
            textControls.style.display = 'none';
            imgControls.style.display = 'block';
            opacitySlider.value = active.opacity;

            // Image Filters
            document.getElementById('prop-filter-gray').checked = active.filters.some(f => f && f.type === 'Grayscale');
            document.getElementById('prop-filter-sepia').checked = active.filters.some(f => f && f.type === 'Sepia');
        }
    }

    // Prop Events
    textInput.addEventListener('input', (e) => {
        const active = canvas.getActiveObject();
        if (active && active.type === 'i-text') {
            active.set('text', e.target.value);
            canvas.renderAll();
        }
    });

    fontSelect.addEventListener('change', (e) => {
        const active = canvas.getActiveObject();
        if (active && active.type === 'i-text') {
            active.set('fontFamily', e.target.value);
            canvas.renderAll();
        }
    });

    colorInput.addEventListener('input', (e) => {
        const active = canvas.getActiveObject();
        if (active && active.type === 'i-text') {
            active.set('fill', e.target.value);
            canvas.renderAll();
        }
    });

    opacitySlider.addEventListener('input', (e) => {
        const active = canvas.getActiveObject();
        if (active) {
            active.set('opacity', parseFloat(e.target.value));
            canvas.renderAll();
        }
    });

    // Advanced Text
    document.getElementById('prop-bold').addEventListener('click', () => {
        const active = canvas.getActiveObject();
        if (active && active.type === 'i-text') {
            const isBold = active.fontWeight === 'bold';
            active.set('fontWeight', isBold ? 'normal' : 'bold');
            document.getElementById('prop-bold').style.background = isBold ? '' : '#e2e8f0';
            canvas.renderAll();
        }
    });

    document.getElementById('prop-italic').addEventListener('click', () => {
        const active = canvas.getActiveObject();
        if (active && active.type === 'i-text') {
            const isItalic = active.fontStyle === 'italic';
            active.set('fontStyle', isItalic ? 'normal' : 'italic');
            document.getElementById('prop-italic').style.background = isItalic ? '' : '#e2e8f0';
            canvas.renderAll();
        }
    });

    document.getElementById('prop-shadow').addEventListener('change', (e) => {
        const active = canvas.getActiveObject();
        if (active && active.type === 'i-text') {
            if (e.target.checked) {
                active.set('shadow', new fabric.Shadow({
                    color: 'rgba(0,0,0,0.5)', blur: 4, offsetX: 2, offsetY: 2
                }));
            } else {
                active.set('shadow', null);
            }
            canvas.renderAll();
        }
    });

    document.getElementById('prop-outline').addEventListener('change', (e) => {
        const active = canvas.getActiveObject();
        if (active && active.type === 'i-text') {
            if (e.target.checked) {
                active.set('stroke', '#000000');
                active.set('strokeWidth', 1);
            } else {
                active.set('stroke', null);
                active.set('strokeWidth', 0);
            }
            canvas.renderAll();
        }
    });

    // Image Filters
    document.getElementById('prop-filter-gray').addEventListener('change', (e) => {
        applyFilter(0, e.target.checked ? new fabric.Image.filters.Grayscale() : null);
    });

    document.getElementById('prop-filter-sepia').addEventListener('change', (e) => {
        applyFilter(1, e.target.checked ? new fabric.Image.filters.Sepia() : null);
    });

    function applyFilter(index, filter) {
        const active = canvas.getActiveObject();
        if (active && active.type === 'image') {
            active.filters[index] = filter;
            active.applyFilters();
            canvas.renderAll();
        }
    }

    // Layer Controls
    document.getElementById('prop-bring-front').addEventListener('click', () => {
        const active = canvas.getActiveObject();
        if (active) active.bringToFront();
    });

    document.getElementById('prop-send-back').addEventListener('click', () => {
        const active = canvas.getActiveObject();
        if (active) active.sendToBack();
    });
}

