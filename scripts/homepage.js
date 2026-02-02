/**
 * SnapPrint Homepage Script
 * Main initialization and data management
 */

// Sample data for demonstration
const heroSlides = [
    {
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1400&h=450&fit=crop',
        alt: 'Custom T-Shirt Printing',
        title: 'Custom T-Shirt Printing',
        description: 'Design your own unique t-shirts with premium quality prints',
        buttonText: 'Explore Now',
        link: '#tshirts',
        aspectRatio: '16/5'
    },
    {
        image: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=1800&h=500&fit=crop',
        alt: 'Personalized Mugs',
        title: 'Personalized Mugs & Cups',
        description: 'Start your day with a custom-printed mug',
        buttonText: 'Shop Mugs',
        link: '#mugs',
        aspectRatio: '18/5'
    },
    {
        image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=1200&h=400&fit=crop',
        alt: 'Phone Cases',
        title: 'Designer Phone Cases',
        description: 'Protect your phone with style - custom printed cases',
        buttonText: 'Browse Cases',
        link: '#cases',
        aspectRatio: '3/1'
    },
    {
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1600&h=450&fit=crop',
        alt: 'Custom Hoodies',
        title: 'Premium Custom Hoodies',
        description: 'Stay warm with personalized hoodies',
        buttonText: 'Shop Now',
        link: '#hoodies',
        aspectRatio: '16/5'
    },
    {
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=2000&h=500&fit=crop',
        alt: 'Eco Bags',
        title: 'Eco-Friendly Tote Bags',
        description: 'Sustainable bags with your custom design',
        buttonText: 'Explore',
        link: '#bags',
        aspectRatio: '4/1'
    }
];

const categories = [
    { name: 'T-Shirts', icon: '👕', count: 150, link: '#tshirts' },
    { name: 'Hoodies', icon: '🧥', count: 80, link: '#hoodies' },
    { name: 'Mugs & Cups', icon: '☕', count: 120, link: '#cups' },
    { name: 'Phone Cases', icon: '📱', count: 200, link: '#cases' },
    { name: 'Photo Frames', icon: '🖼️', count: 90, link: '#frames' },
    { name: 'Key Chains', icon: '🔑', count: 65, link: '#keychains' },
    { name: 'Face Masks', icon: '😷', count: 45, link: '#masks' },
    { name: 'Tote Bags', icon: '👜', count: 75, link: '#bags' },
    { name: 'Pendants', icon: '💎', count: 55, link: '#pendants' },
    { name: 'Slippers', icon: '🩴', count: 40, link: '#slippers' }
];

const featuredProducts = [
    {
        title: 'Custom Photo T-Shirt',
        description: 'Premium cotton with high-quality photo print',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        price: 499,
        originalPrice: 999,
        rating: 4.5,
        reviewCount: 234,
        badge: 'BESTSELLER',
        link: '#product-1',
        productId: 'prod-001'
    },
    {
        title: 'Personalized Coffee Mug',
        description: 'Ceramic mug with your favorite photo',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop',
        price: 299,
        originalPrice: 499,
        rating: 4.8,
        reviewCount: 456,
        badge: 'POPULAR',
        link: '#product-2',
        productId: 'prod-002'
    },
    {
        title: 'Designer Phone Case',
        description: 'Durable case with custom artwork',
        image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
        price: 349,
        originalPrice: 699,
        rating: 4.6,
        reviewCount: 189,
        link: '#product-3',
        productId: 'prod-003'
    },
    {
        title: 'Photo Frame - Wooden',
        description: 'Elegant wooden frame with custom print',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop',
        price: 599,
        originalPrice: 1199,
        rating: 4.7,
        reviewCount: 145,
        badge: 'NEW',
        link: '#product-4',
        productId: 'prod-004'
    },
    {
        title: 'Custom Hoodie',
        description: 'Warm and cozy with your design',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
        price: 899,
        originalPrice: 1599,
        rating: 4.9,
        reviewCount: 312,
        badge: 'SALE',
        link: '#product-5',
        productId: 'prod-005'
    },
    {
        title: 'Personalized Keychain',
        description: 'Metal keychain with photo engraving',
        image: 'https://images.unsplash.com/photo-1582639590011-f5a8416d1101?w=400&h=400&fit=crop',
        price: 199,
        originalPrice: 399,
        rating: 4.4,
        reviewCount: 98,
        link: '#product-6',
        productId: 'prod-006'
    }
];

const specialOffers = [
    {
        title: 'T-Shirt Combo',
        subtitle: 'LIMITED OFFER',
        image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=300&fit=crop',
        link: '#combo-1',
        ctaText: 'Buy Now',
        bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
        title: 'Mug Collection',
        subtitle: 'SPECIAL DEAL',
        image: 'https://images.unsplash.com/photo-1517256673644-36ad11246d21?w=400&h=300&fit=crop',
        link: '#combo-2',
        ctaText: 'Shop Now',
        bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
        title: 'Phone Cases',
        subtitle: 'BUY 2 GET 1',
        image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop',
        link: '#combo-3',
        ctaText: 'Grab Deal',
        bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
];

const trendingProducts = [
    {
        title: 'Vintage Logo T-Shirt',
        description: 'Retro style custom logo print',
        image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop',
        price: 549,
        originalPrice: 999,
        rating: 4.6,
        reviewCount: 178,
        link: '#trending-1',
        productId: 'prod-007'
    },
    {
        title: 'Gradient Face Mask',
        description: 'Stylish and comfortable fabric mask',
        image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=400&h=400&fit=crop',
        price: 149,
        originalPrice: 299,
        rating: 4.3,
        reviewCount: 89,
        link: '#trending-2',
        productId: 'prod-008'
    },
    {
        title: 'Tote Bag - Canvas',
        description: 'Eco-friendly bag with custom print',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop',
        price: 399,
        originalPrice: 699,
        rating: 4.7,
        reviewCount: 267,
        badge: 'ECO',
        link: '#trending-3',
        productId: 'prod-009'
    },
    {
        title: 'Stone Pendant',
        description: 'Beautiful pendant with photo inlay',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
        price: 799,
        originalPrice: 1499,
        rating: 4.8,
        reviewCount: 134,
        link: '#trending-4',
        productId: 'prod-010'
    },
    {
        title: 'Custom Slippers',
        description: 'Comfortable slippers with your design',
        image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop',
        price: 449,
        originalPrice: 799,
        rating: 4.5,
        reviewCount: 92,
        link: '#trending-5',
        productId: 'prod-011'
    },
    {
        title: 'Child Costume',
        description: 'Fun costume with custom character print',
        image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=400&fit=crop',
        price: 699,
        originalPrice: 1299,
        rating: 4.9,
        reviewCount: 201,
        badge: 'HOT',
        link: '#trending-6',
        productId: 'prod-012'
    }
];

const mostLovedProducts = [
    {
        title: 'Classic White T-Shirt',
        description: 'Best selling plain tee for custom prints',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        price: 399,
        originalPrice: 699,
        rating: 4.9,
        reviewCount: 567,
        badge: 'LOVED',
        link: '#loved-1',
        productId: 'prod-013'
    },
    {
        title: 'Premium Ceramic Mug',
        description: 'Most ordered mug design',
        image: 'https://images.unsplash.com/photo-1608667508764-33cf0726b13a?w=400&h=400&fit=crop',
        price: 349,
        originalPrice: 599,
        rating: 4.8,
        reviewCount: 892,
        link: '#loved-2',
        productId: 'prod-014'
    },
    {
        title: 'Leather Keychain',
        description: 'Premium leather with engraving',
        image: 'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=400&h=400&fit=crop',
        price: 249,
        originalPrice: 499,
        rating: 4.7,
        reviewCount: 423,
        link: '#loved-3',
        productId: 'prod-015'
    },
    {
        title: 'Glass Photo Frame',
        description: 'Elegant glass frame - customer favorite',
        image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&h=400&fit=crop',
        price: 699,
        originalPrice: 1299,
        rating: 4.9,
        reviewCount: 678,
        badge: 'PREMIUM',
        link: '#loved-4',
        productId: 'prod-016'
    },
    {
        title: 'Black Hoodie',
        description: 'Most popular hoodie choice',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
        price: 999,
        originalPrice: 1799,
        rating: 5.0,
        reviewCount: 1234,
        link: '#loved-5',
        productId: 'prod-017'
    },
    {
        title: 'Canvas Tote',
        description: 'Eco-friendly and stylish',
        image: 'https://images.unsplash.com/photo-1591561954555-607968d502c0?w=400&h=400&fit=crop',
        price: 449,
        originalPrice: 799,
        rating: 4.8,
        reviewCount: 534,
        link: '#loved-6',
        productId: 'prod-018'
    }
];

const newArrivals = [
    {
        title: 'Neon Print T-Shirt',
        description: 'Vibrant neon designs',
        image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop',
        price: 599,
        originalPrice: 999,
        rating: 4.6,
        reviewCount: 89,
        badge: 'NEW',
        link: '#new-1',
        productId: 'prod-019'
    },
    {
        title: 'Designer Cushion Cover',
        description: 'Premium fabric with custom print',
        image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=400&fit=crop',
        price: 299,
        originalPrice: 599,
        rating: 4.5,
        reviewCount: 67,
        badge: 'NEW',
        link: '#new-2',
        productId: 'prod-020'
    },
    {
        title: 'Metal Water Bottle',
        description: 'Insulated with custom engraving',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
        price: 799,
        originalPrice: 1299,
        rating: 4.7,
        reviewCount: 156,
        link: '#new-3',
        productId: 'prod-021'
    },
    {
        title: 'Laptop Sleeve',
        description: 'Padded protection with custom design',
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop',
        price: 549,
        originalPrice: 999,
        rating: 4.8,
        reviewCount: 234,
        badge: 'HOT',
        link: '#new-4',
        productId: 'prod-022'
    },
    {
        title: 'Yoga Mat Custom',
        description: 'Non-slip with motivational prints',
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
        price: 899,
        originalPrice: 1599,
        rating: 4.9,
        reviewCount: 178,
        link: '#new-5',
        productId: 'prod-023'
    },
    {
        title: 'Calendar 2026',
        description: 'Personalized wall calendar',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
        price: 249,
        originalPrice: 499,
        rating: 4.6,
        reviewCount: 92,
        link: '#new-6',
        productId: 'prod-024'
    }
];

const bestSellers = [
    {
        title: 'Photo Collage Frame',
        description: 'Multiple photos in one frame',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop',
        price: 899,
        originalPrice: 1599,
        rating: 5.0,
        reviewCount: 892,
        badge: 'BESTSELLER',
        link: '#best-1',
        productId: 'prod-025'
    },
    {
        title: 'Custom Apron',
        description: 'Kitchen apron with funny quotes',
        image: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400&h=400&fit=crop',
        price: 399,
        originalPrice: 799,
        rating: 4.7,
        reviewCount: 567,
        link: '#best-2',
        productId: 'prod-026'
    },
    {
        title: 'Pop Socket Grip',
        description: 'Phone grip with custom photo',
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
        price: 149,
        originalPrice: 299,
        rating: 4.8,
        reviewCount: 1234,
        link: '#best-3',
        productId: 'prod-027'
    },
    {
        title: 'Notebook Custom',
        description: 'Personalized journal/diary',
        image: 'https://images.unsplash.com/photo-1517842264405-16ad5f7a5940?w=400&h=400&fit=crop',
        price: 299,
        originalPrice: 599,
        rating: 4.9,
        reviewCount: 678,
        badge: 'POPULAR',
        link: '#best-4',
        productId: 'prod-028'
    },
    {
        title: 'Mouse Pad XL',
        description: 'Large gaming mousepad with art',
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
        price: 399,
        originalPrice: 799,
        rating: 4.6,
        reviewCount: 445,
        link: '#best-5',
        productId: 'prod-029'
    },
    {
        title: 'Wall Clock',
        description: 'Custom photo wall clock',
        image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&h=400&fit=crop',
        price: 699,
        originalPrice: 1299,
        rating: 4.8,
        reviewCount: 334,
        link: '#best-6',
        productId: 'prod-030'
    }
];

// Initialize homepage
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 SnapPrint Homepage Loading...');

    // Initialize hamburger menu FIRST to ensure it always works
    initHamburgerMenu();

    // Initialize hero slider
    initHeroSlider();

    // Render categories
    renderCategories(categories, 'category-grid');

    // Render product sections
    renderProducts(featuredProducts, 'featured-products', { variant: 'default' });
    renderProducts(trendingProducts, 'trending-products', { variant: 'curved-bottom' });
    renderProducts(newArrivals, 'new-arrivals', { variant: 'default' });
    renderProducts(bestSellers, 'best-sellers', { variant: 'curved-all' });
    renderProducts(mostLovedProducts, 'most-loved', { variant: 'curved-bottom' });

    // Render special offers carousel
    renderSpecialCarousel(specialOffers, 'special-offers', { enableDrag: true });

    // Initialize wishlist states
    setTimeout(() => {
        if (typeof initializeWishlistStates === 'function') {
            initializeWishlistStates();
        }
    }, 100);

    // Add scroll animations
    addScrollAnimations();

    // Add smooth scroll to anchor links
    addSmoothScroll();

    console.log('✅ SnapPrint Homepage Ready!');
});

/**
 * Initialize hero slider
 */
function initHeroSlider() {
    if (typeof SlideshowWidget !== 'undefined') {
        new SlideshowWidget({
            containerId: 'hero-slider',
            slides: heroSlides,
            autoPlay: true,
            interval: 5000,
            showDots: true,
            showArrows: true,
            adaptiveWidth: true
        });
    }
}

/**
 * Add scroll animations for elements
 */
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out both';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('.products-section, .banner-section').forEach(section => {
        observer.observe(section);
    });
}

/**
 * Add smooth scroll behavior to anchor links
 */
function addSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize hamburger menu for mobile
 */
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const headerActions = document.querySelector('.header-actions');

    console.log('Hamburger found:', hamburger);
    console.log('Header actions found:', headerActions);

    if (hamburger && headerActions) {
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hamburger clicked!');
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
    } else {
        console.error('Hamburger menu elements not found!');
    }
}

/**
 * Utility: Format currency
 */
function formatCurrency(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Utility: Get random items from array
 */
function getRandomItems(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.SnapPrint = {
        formatCurrency,
        getRandomItems,
        categories,
        featuredProducts,
        trendingProducts,
        mostLovedProducts,
        newArrivals,
        bestSellers
    };
}