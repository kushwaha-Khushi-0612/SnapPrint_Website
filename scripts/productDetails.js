/**
 * Product Details Page Script
 */

// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id') || 'prod-001';

/// Global state
let productData = null;

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
        
        renderProducts(await window.dataService.getRandomProducts(10), 'mixed-categories-final');
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
    if(document.getElementById('review-count-tab')) document.getElementById('review-count-tab').textContent = rvCount.toLocaleString();
    
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
        if(badgeEl) badgeEl.style.display = 'none';
    }
    
    // Update description
    document.getElementById('product-description').textContent = productData.description;
    
    // Update highlights
    const highlightsList = document.getElementById('product-highlights-list');
    if (highlightsList) highlightsList.innerHTML = productData.highlights.map(h => `<li>${h}</li>`).join('');
    
    document.title = `${productData.title} - SnapPrint`;
}

/**
 * Setup image gallery
 */
function setupImageGallery() {
    const mainImage = document.getElementById('main-product-image');
    const thumbnailGallery = document.getElementById('thumbnail-gallery');
    
    // Create thumbnails
    thumbnailGallery.innerHTML = productData.images.map((img, index) => `
        <div class="thumbnail ${index === 0 ? 'active' : ''}" data-image="${img}">
            <img src="${img}" alt="Product view ${index + 1}">
        </div>
    `).join('');
    
    // Add click handlers
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', () => {
            // Update main image
            mainImage.src = thumb.dataset.image;
            
            // Update active state
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
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
    
    decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        if (currentValue > 1) {
            qtyInput.value = currentValue - 1;
        }
    });
    
    increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        if (currentValue < 10) {
            qtyInput.value = currentValue + 1;
        }
    });
}

/**
 * Setup action buttons
 */
function setupActionButtons() {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const buyNowBtn = document.getElementById('buy-now-btn');
    
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


