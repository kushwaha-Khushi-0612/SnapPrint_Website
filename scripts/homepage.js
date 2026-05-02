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
            icon: typeof getCategoryIcon === 'function' ? getCategoryIcon(cat.name) : '📦',
            count: count,
            link: `productCategory.html?category=${encodeURIComponent(cat.name)}`
        };
    });

    // Load and render Promo Banners dynamically
    await loadAndRenderPromos();

    // Render categories immediately so there is zero lag
    renderCategories(categories, 'category-grid');

    // Fetch dynamic products and discounts asynchronously without blocking the UI
    (async () => {
        try {
            // Fetch discounts in parallel
            const discPromise = fetch('data/discounts.json').then(r => r.json()).catch(e => { console.warn(e); return null; });

            // Pre-flatten database once
            await window.dataService.getAllProductsFlattened();

            // Now run all random generators concurrently
            const [
                featuredProducts, specialOccasions, flashSales, trendingProducts,
                newArrivals, mostLovedProducts, curatedCollections, bestSellers,
                youMightLike, recentlyViewed, surprisePicks, randomFinal, discData
            ] = await Promise.all([
                window.dataService.getRandomProducts(6),
                window.dataService.getRandomProducts(6),
                window.dataService.getRandomProducts(8),
                window.dataService.getRandomProducts(6),
                window.dataService.getRandomProducts(6),
                window.dataService.getRandomProducts(6),
                window.dataService.getRandomProducts(8),
                window.dataService.getRandomProducts(8),
                window.dataService.getRecommendedProducts(12),
                window.dataService.getRecentlyViewedProducts(8),
                window.dataService.getRandomProducts(12),
                window.dataService.getRandomProducts(12),
                discPromise
            ]);

            // Render Discounts
            if (discData && discData.discounts) {
                const discContainer = document.getElementById('special-offers');
                if (discContainer) {
                    discContainer.innerHTML = discData.discounts.map(d => window.createDiscountCard(d)).join('');
                    initCarouselNav('special-offers');
                }
            }

            // Render product sections
            renderProducts(featuredProducts, 'featured-products', { variant: 'default' });
            renderProducts(specialOccasions, 'special-occasions', { variant: 'colored', enableCardColors: true });
            renderProducts(flashSales, 'flash-sales', { variant: 'curved-all' });
            renderProducts(trendingProducts, 'trending-products', { variant: 'curved-bottom' });
            renderProducts(newArrivals, 'new-arrivals', { variant: 'default' });

            if (recentlyViewed.length > 0) {
                document.getElementById('recently-viewed').parentElement.style.display = 'block';
                renderProducts(recentlyViewed, 'recently-viewed', { variant: 'colored', enableCardColors: true });
            } else {
                document.getElementById('recently-viewed').parentElement.style.display = 'none';
            }

            renderProducts(curatedCollections, 'curated-collections', { variant: 'curved-bottom' });
            renderProducts(bestSellers, 'best-sellers', { variant: 'curved-all' });
            renderProducts(mostLovedProducts, 'most-loved', { variant: 'curved-bottom' });
            renderProducts(youMightLike, 'you-might-like', { variant: 'colored', enableCardColors: true });

            const mixedGrid = document.getElementById('you-might-like');
            if (mixedGrid) mixedGrid.classList.add('product-grid-dense');

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
        } catch (error) {
            console.error("Error loading homepage products:", error);
        }
    })();

    // Add scroll animations
    addScrollAnimations();
    // Add smooth scroll to anchor links
    addSmoothScroll();

    console.log('✅ SnapPrint Homepage Ready!');
});

/**
 * Initialize Carousel Navigation
 * @param {string} containerId 
 */
function initCarouselNav(containerId) {
    const container = document.getElementById(containerId);
    const prevBtn = document.querySelector(`[data-carousel="${containerId}"].prev`);
    const nextBtn = document.querySelector(`[data-carousel="${containerId}"].next`);

    if (!container || !prevBtn || !nextBtn) return;

    const scrollAmount = container.firstElementChild ? container.firstElementChild.offsetWidth + 20 : 440;

    prevBtn.addEventListener('click', () => {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    // Hide buttons if not scrollable
    const toggleButtons = () => {
        if (container.scrollLeft <= 0) {
            prevBtn.style.opacity = '0.3';
            prevBtn.style.pointerEvents = 'none';
        } else {
            prevBtn.style.opacity = '1';
            prevBtn.style.pointerEvents = 'auto';
        }

        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 5) {
            nextBtn.style.opacity = '0.3';
            nextBtn.style.pointerEvents = 'none';
        } else {
            nextBtn.style.opacity = '1';
            nextBtn.style.pointerEvents = 'auto';
        }
    };

    container.addEventListener('scroll', toggleButtons);
    window.addEventListener('resize', toggleButtons);
    toggleButtons();
}

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

/**
 * Fetch and Render Promos
 */
async function loadAndRenderPromos() {
    try {
        const response = await fetch('data/promos.json');
        if (!response.ok) throw new Error('Failed to load promos');
        const data = await response.json();

        const container = document.querySelector('.promo-banners-container');
        if (!container) return;

        // Main banner
        const main = data.mainPromo;
        const mainHtml = `
            <div class="promo-banner-main" style="background-image: ${main.gradient}, url('${main.image}'); cursor: pointer;" onclick="window.location.href='${main.link}'">
                <div class="promo-content-left">
                    <h2>${main.title}</h2>
                    <p>${main.subtitle}</p>
                    <button class="shop-now-btn" onclick="event.stopPropagation(); window.location.href='${main.link}'">${main.buttonText}</button>
                </div>
            </div>
        `;

        // Secondary banners grouped into rows
        let secondaryHtml = '<div class="promo-secondary-grid">';

        // Chunk array into groups of 3
        const chunkSize = 3;
        for (let i = 0; i < data.secondaryPromos.length; i += chunkSize) {
            const chunk = data.secondaryPromos.slice(i, i + chunkSize);
            secondaryHtml += '<div class="promo-row">';

            chunk.forEach(promo => {
                const bgStyle = promo.image
                    ? `background-image: ${promo.gradient}, url('${promo.image}');`
                    : `background: ${promo.gradient};`;

                const titleStyle = promo.textColorTitle ? `color: ${promo.textColorTitle};` : '';
                const subStyle = promo.textColorSubtitle ? `color: ${promo.textColorSubtitle}; font-family: cursive;` : '';
                const btnStyle = (promo.buttonColor || promo.buttonTextColor)
                    ? `style="background: ${promo.buttonColor || '#000'}; color: ${promo.buttonTextColor || '#fff'};"`
                    : '';

                const floatingIcon = promo.floatingIcon
                    ? `<img src="${promo.floatingIcon}" class="floating-icon" alt="Icon" style="position: absolute; right: 20px; bottom: 20px; width: 60px; opacity: 0.2; pointer-events: none;">`
                    : '';

                secondaryHtml += `
                    <div class="promo-banner-card" style="${bgStyle} cursor: pointer;" onclick="window.location.href='${promo.link}'">
                        <div class="promo-content">
                            <h3 style="${titleStyle}">${promo.title}</h3>
                            <p style="${subStyle}">${promo.subtitle}</p>
                            <button class="order-now-btn" ${btnStyle} onclick="event.stopPropagation(); window.location.href='${promo.link}'">${promo.buttonText}</button>
                        </div>
                        ${floatingIcon}
                    </div>
                `;
            });
            secondaryHtml += '</div>'; // End promo-row
        }
        secondaryHtml += '</div>'; // End promo-secondary-grid

        container.innerHTML = mainHtml + secondaryHtml;

        // Init mobile slider
        initMobilePromoSlider();

    } catch (e) {
        console.error('Error rendering promos:', e);
    }
}

/**
 * Mobile Auto Slideshow
 */
function initMobilePromoSlider() {
    const grid = document.querySelector('.promo-secondary-grid');
    if (!grid) return;

    let isScrolling = false;
    let scrollInterval;

    const startAutoScroll = () => {
        if (window.innerWidth > 768) return;

        scrollInterval = setInterval(() => {
            if (isScrolling) return;
            const maxScroll = grid.scrollWidth - grid.clientWidth;
            if (maxScroll <= 0) return;

            let nextScroll = grid.scrollLeft + grid.clientWidth * 0.85;
            if (nextScroll >= maxScroll - 10) {
                nextScroll = 0;
            }
            grid.scrollTo({ left: nextScroll, behavior: 'smooth' });
        }, 3000);
    };

    const stopAutoScroll = () => clearInterval(scrollInterval);

    grid.addEventListener('touchstart', () => { isScrolling = true; stopAutoScroll(); }, { passive: true });
    grid.addEventListener('touchend', () => { isScrolling = false; startAutoScroll(); }, { passive: true });

    startAutoScroll();
    window.addEventListener('resize', () => { stopAutoScroll(); startAutoScroll(); });
}
