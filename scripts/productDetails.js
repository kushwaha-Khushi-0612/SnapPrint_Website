/**
 * Product Details Page Script
 */

// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id') || 'prod-001';

// Sample product data (in real app, fetch from API)
const productData = {
    id: 'prod-001',
    title: 'Custom Print Round Neck T-Shirt',
    category: 'T-Shirts',
    categoryLink: 'productCategory.html?category=tshirts',
    description: 'Experience premium comfort with our custom printed t-shirts. Made from 100% pure cotton with 220 GSM fabric weight, these tees are perfect for everyday wear. Our advanced printing technology ensures vibrant, long-lasting prints that won\'t fade or crack even after multiple washes.',
    price: 499,
    originalPrice: 799,
    rating: 4.5,
    reviewCount: 1234,
    badge: 'NEW',
    images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=600&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Grey', hex: '#808080' },
        { name: 'Navy', hex: '#001f3f' },
        { name: 'Red', hex: '#DC143C' }
    ],
    highlights: [
        'Premium 220 GSM fabric - Soft & comfortable',
        '100% cotton - Breathable for all-day wear',
        'Custom print quality - Vibrant & long-lasting colors',
        'Pre-shrunk fabric - Maintains size after wash',
        'Available in 5+ colors and all sizes'
    ]
};

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

// Generate sample products
const generateProducts = (category, count = 6) => {
    const products = [];
    const images = [
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
            title: `${category} Design ${i + 1}`,
            description: `Premium custom ${category.toLowerCase()}`,
            image: images[i % images.length],
            price: price,
            originalPrice: originalPrice,
            discount: discount,
            rating: (Math.random() * 1.5 + 3.5).toFixed(1),
            reviewCount: Math.floor(Math.random() * 500) + 50,
            link: `productDetails.html?id=prod-${i + 1}`,
            productId: `prod-${i + 1}`
        });
    }
    
    return products;
};

// Viral products
const viralProducts = generateProducts('T-Shirt', 8);

// Most viewed products
const mostViewedProducts = [
    ...generateProducts('Mug', 3),
    ...generateProducts('Hoodie', 3),
    ...generateProducts('Phone Case', 2)
];

// Mixed category products
const mixedCategoryProducts = [
    ...generateProducts('T-Shirt', 3),
    ...generateProducts('Mug', 3),
    ...generateProducts('Phone Case', 3),
    ...generateProducts('Frame', 3)
];

// Related products
const relatedProducts = generateProducts('T-Shirt', 8);

// Customers Also Bought products
const customersAlsoBought = generateProducts('T-Shirt', 6);

// Bundled Offers products
const bundledOffers = generateProducts('Bundle', 4).map((p, i) => {
    p.title = ['T-Shirt + Mug', 'Couple Hoodies', 'Phone Case + Pop Socket', '2x T-Shirts'][i];
    p.badge = 'BUNDLE SAVE';
    return p;
});

// Previously viewed products
const previouslyViewedProducts = [
    {
        title: 'Custom Mug Design',
        description: 'Premium custom mug',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop',
        price: 299,
        originalPrice: 499,
        discount: 40,
        rating: 4.6,
        reviewCount: 189,
        link: 'productDetails.html?id=prev-1',
        productId: 'prev-001',
        viewedTime: 'Viewed 2 hours ago'
    },
    {
        title: 'Phone Case Premium',
        description: 'Premium custom phone case',
        image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
        price: 399,
        originalPrice: 599,
        discount: 33,
        rating: 4.8,
        reviewCount: 234,
        link: 'productDetails.html?id=prev-2',
        productId: 'prev-002',
        viewedTime: 'Viewed yesterday'
    },
    {
        title: 'Wooden Photo Frame',
        description: 'Premium custom frame',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop',
        price: 599,
        originalPrice: 999,
        discount: 40,
        rating: 4.7,
        reviewCount: 156,
        link: 'productDetails.html?id=prev-3',
        productId: 'prev-003',
        viewedTime: 'Viewed 3 days ago'
    },
    {
        title: 'Custom Hoodie',
        description: 'Premium custom hoodie',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
        price: 899,
        originalPrice: 1499,
        discount: 40,
        rating: 4.9,
        reviewCount: 345,
        link: 'productDetails.html?id=prev-4',
        productId: 'prev-004',
        viewedTime: 'Viewed last week'
    }
];

// Final mixed categories products (at bottom of page)
const mixedCategoriesFinal = [
    {
        title: 'Custom Tote Bag',
        description: 'Premium canvas tote bag',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop',
        price: 349,
        originalPrice: 599,
        discount: 42,
        rating: 4.5,
        reviewCount: 178,
        link: 'productDetails.html?id=tote-1',
        productId: 'tote-001'
    },
    {
        title: 'Custom Keychain',
        description: 'Premium metal keychain',
        image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop',
        price: 149,
        originalPrice: 249,
        discount: 40,
        rating: 4.4,
        reviewCount: 234,
        link: 'productDetails.html?id=key-1',
        productId: 'key-001'
    },
    {
        title: 'Premium Face Mask',
        description: 'Custom printed face mask',
        image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400&h=400&fit=crop',
        price: 199,
        originalPrice: 349,
        discount: 43,
        rating: 4.6,
        reviewCount: 456,
        link: 'productDetails.html?id=mask-1',
        productId: 'mask-001'
    },
    {
        title: 'Custom Pendant',
        description: 'Premium custom pendant',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
        price: 799,
        originalPrice: 1299,
        discount: 38,
        rating: 4.8,
        reviewCount: 289,
        link: 'productDetails.html?id=pend-1',
        productId: 'pend-001'
    },
    {
        title: 'Custom Slippers',
        description: 'Premium printed slippers',
        image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop',
        price: 449,
        originalPrice: 749,
        discount: 40,
        rating: 4.3,
        reviewCount: 167,
        link: 'productDetails.html?id=slip-1',
        productId: 'slip-001'
    },
    {
        title: 'Stone Pasting Art',
        description: 'Premium stone pasting',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop',
        price: 999,
        originalPrice: 1599,
        discount: 38,
        rating: 4.9,
        reviewCount: 312,
        link: 'productDetails.html?id=stone-1',
        productId: 'stone-001'
    },
    {
        title: 'Custom Child Costume',
        description: 'Premium child costume',
        image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=400&fit=crop',
        price: 1199,
        originalPrice: 1999,
        discount: 40,
        rating: 4.7,
        reviewCount: 234,
        link: 'productDetails.html?id=costume-1',
        productId: 'costume-001'
    },
    {
        title: '2D Mobile Cover',
        description: 'Premium 2D mobile cover',
        image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
        price: 299,
        originalPrice: 499,
        discount: 40,
        rating: 4.6,
        reviewCount: 445,
        link: 'productDetails.html?id=cover-1',
        productId: 'cover-001'
    },
    {
        title: 'Custom Hoodie Pro',
        description: 'Premium custom hoodie',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
        price: 999,
        originalPrice: 1599,
        discount: 38,
        rating: 4.8,
        reviewCount: 567,
        link: 'productDetails.html?id=hood-1',
        productId: 'hood-001'
    },
    {
        title: 'Custom Coffee Mug',
        description: 'Premium ceramic mug',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop',
        price: 249,
        originalPrice: 399,
        discount: 38,
        rating: 4.5,
        reviewCount: 389,
        link: 'productDetails.html?id=mug-1',
        productId: 'mug-001'
    },
    {
        title: 'Wooden Photo Frame',
        description: 'Premium wooden frame',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop',
        price: 649,
        originalPrice: 999,
        discount: 35,
        rating: 4.7,
        reviewCount: 278,
        link: 'productDetails.html?id=frame-1',
        productId: 'frame-001'
    },
    {
        title: 'Premium T-Shirt',
        description: 'Custom printed t-shirt',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        price: 499,
        originalPrice: 799,
        discount: 38,
        rating: 4.8,
        reviewCount: 1234,
        link: 'productDetails.html?id=tshirt-1',
        productId: 'tshirt-001'
    }
];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Loading Product Details Page...');
    
    // Initialize hamburger menu
    initHamburgerMenu();
    
    // Load product data
    loadProductData();
    
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
    
    // Load reviews
    loadReviews();
    
    // Load product sections
    renderProducts(viralProducts, 'viral-products');
    renderProducts(mostViewedProducts, 'most-viewed-products');
    renderProducts(mixedCategoryProducts, 'mixed-category-products');
    renderProducts(relatedProducts, 'related-products');
    renderProducts(customersAlsoBought, 'customers-also-bought');
    renderProducts(previouslyViewedProducts, 'previously-viewed');
    renderProducts(bundledOffers, 'bundled-offers');
    renderProducts(mixedCategoriesFinal, 'mixed-categories-final');
    
    console.log('✅ Product Details Page Ready!');
});



/**
 * Load product data into page
 */
function loadProductData() {
    // Update breadcrumb
    document.getElementById('breadcrumb-category').textContent = productData.category;
    document.getElementById('breadcrumb-category').href = productData.categoryLink;
    document.getElementById('breadcrumb-product').textContent = productData.title;
    
    // Update product info
    document.getElementById('product-category').textContent = 'Men Fashion';
    document.getElementById('product-title').textContent = productData.title;
    document.getElementById('rating-value').textContent = productData.rating;
    document.getElementById('review-count').textContent = productData.reviewCount.toLocaleString();
    document.getElementById('review-count-tab').textContent = productData.reviewCount.toLocaleString();
    
    // Calculate discount
    const discount = Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100);
    document.getElementById('discount-badge').textContent = `-${discount}%`;
    document.getElementById('current-price').textContent = `₹${productData.price}`;
    document.getElementById('original-price').textContent = `₹${productData.originalPrice}`;
    
    // Update badge
    if (productData.badge) {
        document.getElementById('product-badge').textContent = productData.badge;
    } else {
        document.getElementById('product-badge').style.display = 'none';
    }
    
    // Update description
    document.getElementById('product-description').textContent = productData.description;
    
    // Update highlights
    const highlightsList = document.getElementById('product-highlights-list');
    highlightsList.innerHTML = productData.highlights.map(h => `<li>${h}</li>`).join('');
    
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
