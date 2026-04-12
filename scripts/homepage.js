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

// Initialize homepage
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 SnapPrint Homepage Loading...');

    // Wait for dataService to load db
    await window.dataService.init();
    
    // Convert JSON database categories to UI categories array
    let dbCategories = window.dataService.productsDB.categories;
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

    let categories = dbCategories.map(cat => {
        let count = 0;
        if (cat.sections) {
            cat.sections.forEach(sec => {
                sec.subcategories.forEach(s => count += (s.products ? s.products.length : 0));
            });
        } else if (cat.subcategories) {
            cat.subcategories.forEach(s => count += (s.products ? s.products.length : 0));
        }
        
        return {
            name: cat.name,
            icon: iconsMap[cat.name] || 'constants/icons/star.svg',
            count: count,
            link: `productCategory.html?category=${encodeURIComponent(cat.name)}`
        };
    });

    // Initialize hero slider
    initHeroSlider();

    // Render categories
    renderCategories(categories, 'category-grid');

    // Fetch dynamic products
    const featuredProducts = await window.dataService.getRandomProducts(6);
    const specialOccasions = await window.dataService.getRandomProducts(6);
    const flashSales = await window.dataService.getRandomProducts(8);
    const trendingProducts = await window.dataService.getRandomProducts(6);
    const newArrivals = await window.dataService.getRandomProducts(6);
    const mostLovedProducts = await window.dataService.getRandomProducts(6);
    const curatedCollections = await window.dataService.getRandomProducts(8);
    const bestSellers = await window.dataService.getRandomProducts(8);
    const youMightLike = await window.dataService.getRecommendedProducts(12);
    const recentlyViewed = await window.dataService.getRecentlyViewedProducts(8);
    
    // Render product sections (using the global widget function)
    renderProducts(featuredProducts, 'featured-products', { variant: 'default' });
    renderProducts(specialOccasions, 'special-occasions', { variant: 'colored', enableCardColors: true });
    renderProducts(flashSales, 'flash-sales', { variant: 'curved-all' });
    renderProducts(trendingProducts, 'trending-products', { variant: 'curved-bottom' });
    renderProducts(newArrivals, 'new-arrivals', { variant: 'default' });
    
    // Render Recently Viewed if exists
    if (recentlyViewed.length > 0) {
        document.getElementById('recently-viewed').parentElement.style.display = 'block';
        renderProducts(recentlyViewed, 'recently-viewed', { variant: 'colored', enableCardColors: true });
    } else {
        document.getElementById('recently-viewed').parentElement.style.display = 'none';
    }

    renderProducts(curatedCollections, 'curated-collections', { variant: 'curved-bottom' });
    renderProducts(bestSellers, 'best-sellers', { variant: 'curved-all' });
    const surprisePicks = await window.dataService.getRandomProducts(12);
    const randomFinal = await window.dataService.getRandomProducts(12);
    
    // Final high-density sections
    renderProducts(mostLovedProducts, 'most-loved', { variant: 'curved-bottom' });
    renderProducts(youMightLike, 'you-might-like', { variant: 'colored', enableCardColors: true });
    
    // Add denser look to final sections
    const mixedGrid = document.getElementById('you-might-like');
    if (mixedGrid) mixedGrid.classList.add('product-grid-dense');

    // Surprise Section - Insert before random
    const randomContainer = document.getElementById('random-discoveries');
    if (randomContainer) {
        const surpriseHtml = `
            <section class="products-section surprise-section">
                <div class="section-header">
                    <h2>✨ Surprise Picks</h2>
                    <p class="section-subtitle">Something out of the blue, just for you</p>
                </div>
                <div id="surprise-picks" class="product-grid product-grid-dense"></div>
            </section>
        `;
        randomContainer.parentElement.insertAdjacentHTML('beforebegin', surpriseHtml);
        renderProducts(surprisePicks, 'surprise-picks', { variant: 'default' });
    }

    renderProducts(randomFinal, 'random-discoveries', { variant: 'default' });
    if (randomContainer) randomContainer.classList.add('product-grid-dense');

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
        getRandomItems
    };
}
