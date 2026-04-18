/**
 * Data Service
 * Centralized service to fetch and filter the unified products.json database.
 */

const dataService = {
    productsDB: null,

    init: async function() {
        if (this.productsDB) return this.productsDB;
        
        try {
            const response = await fetch('data/products.json');
            this.productsDB = await response.json();
            return this.productsDB;
        } catch (error) {
            console.error('Failed to load products.json:', error);
            return null;
        }
    },

    getAllProductsFlattened: async function() {
        await this.init();
        let allProds = [];
        this.productsDB.categories.forEach(cat => {
            const processSub = (sub, parentName) => {
                sub.products.forEach(p => {
                    p.categoryName = cat.name;
                    p.subcategoryName = sub.name;
                    p.subcategoryId = sub.id;
                    p.parentSection = parentName;
                    
                    // Normalize image path
                    if (!p.image && p.baseImagePath && p.images && p.images.length > 0) {
                        p.image = p.baseImagePath + p.images[0];
                    } else if (!p.image) {
                        p.image = 'constants/products/placeholder.jpg'; // safe fallback
                    }

                    // Dynamic UI Link Injection
                    p.link = `productDetails.html?id=${p.id}`;
                    
                    allProds.push(p);
                });
            };

            if (cat.sections) {
                cat.sections.forEach(section => {
                    section.subcategories.forEach(sub => processSub(sub, section.name));
                });
            } else if (cat.subcategories) {
                cat.subcategories.forEach(sub => processSub(sub, cat.name));
            }
        });
        return allProds;
    },

    getProductsByCategory: async function(categoryNameRegex) {
        await this.init();
        const regex = new RegExp(categoryNameRegex, 'i');
        let matched = [];
        
        const all = await this.getAllProductsFlattened();
        return all.filter(p => regex.test(p.categoryName));
    },

    /**
     * Get products based on user interests
     */
    getRecommendedProducts: async function(count = 8) {
        const all = await this.getAllProductsFlattened();
        const interests = window.analyticsService ? window.analyticsService.getData() : null;
        
        if (!interests) return this.getRandomProducts(count);
        
        const topCats = window.analyticsService.getTopCategories(3);
        const topBadges = window.analyticsService.getTopBadges(3);
        
        // Filter products that match top categories OR top badges
        let recommended = all.filter(p => 
            topCats.includes(p.categoryName) || 
            (p.badge && topBadges.includes(p.badge))
        );
        
        if (recommended.length < count) {
            // Fill with random products if not enough recommendations
            const randoms = all.filter(p => !recommended.find(r => r.id === p.id))
                               .sort(() => 0.5 - Math.random());
            recommended = recommended.concat(randoms.slice(0, count - recommended.length));
        }
        
        return recommended.sort(() => 0.5 - Math.random()).slice(0, count);
    },

    /**
     * Get products from user's view history
     */
    getRecentlyViewedProducts: async function(count = 6) {
        const historyIds = window.analyticsService ? window.analyticsService.getData().viewHistory : [];
        if (historyIds.length === 0) return [];
        
        const all = await this.getAllProductsFlattened();
        return historyIds.map(id => all.find(p => p.id === id)).filter(p => p);
    },

    /**
     * Get random products across categories
     */
    getRandomProducts: async function(count = 6) {
        const all = await this.getAllProductsFlattened();
        return all.sort(() => 0.5 - Math.random()).slice(0, count);
    },

    getProductById: async function(id) {
        let all = await this.getAllProductsFlattened();
        return all.find(p => p.id === id) || null;
    }
};

window.dataService = dataService;
