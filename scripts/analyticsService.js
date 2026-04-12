/**
 * SnapPrint Analytics Service
 * Tracks user interactions and builds an interest profile.
 */

const analyticsService = {
    STORAGE_KEY: 'snapprint_analytics',
    MAX_HISTORY: 20,

    init: async function() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            const defaultData = {
                categoryInterests: {}, 
                subcategoryInterests: {},
                badgeInterests: {},
                viewHistory: [], 
                lastInteracted: Date.now()
            };
            
            // Check if we can pre-populate from server-side profile session
            const session = localStorage.getItem('snapprint_active_session');
            if (session) {
                try {
                    const user = JSON.parse(session);
                    if (user && user.analytics) {
                        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user.analytics));
                        return;
                    }
                } catch(e) {}
            }
            
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultData));
        }
    },

    getData: function() {
        this.init();
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY));
    },

    saveData: function(data) {
        data.lastInteracted = Date.now();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    /**
     * Track a product view
     * @param {Object} product - Product object
     */
    trackProductView: function(product) {
        if (!product || !product.id) return;
        
        let data = this.getData();
        
        // 1. Update View History (Previously Viewed)
        data.viewHistory = data.viewHistory.filter(id => id !== product.id);
        data.viewHistory.unshift(product.id);
        if (data.viewHistory.length > this.MAX_HISTORY) {
            data.viewHistory.pop();
        }

        // 2. Update Category Interests
        if (product.categoryName) {
            data.categoryInterests[product.categoryName] = (data.categoryInterests[product.categoryName] || 0) + 1;
        }

        // 3. Update Subcategory Interests
        if (product.subcategoryName) {
            data.subcategoryInterests[product.subcategoryName] = (data.subcategoryInterests[product.subcategoryName] || 0) + 1;
        }

        // 4. Update Badge Interests
        if (product.badge) {
            data.badgeInterests[product.badge] = (data.badgeInterests[product.badge] || 0) + 1;
        }

        this.saveData(data);
        this.syncWithServer();
    },

    /**
     * Sync data with server if user is logged in
     */
    syncWithServer: async function() {
        // Try to get user ID from sessionStorage/localStorage (auth session)
        const session = localStorage.getItem('snapprint_active_session');
        if (!session) return;
        
        try {
            const user = JSON.parse(session);
            if (!user || !user.id) return;

            const data = this.getData();
            
            await fetch('api/sync_analytics.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    analytics: data
                })
            });
        } catch (e) {
            console.warn('Analytics sync failed:', e);
        }
    },

    /**
     * Track a category click
     * @param {string} categoryName - Name of the category
     */
    trackCategoryClick: function(categoryName) {
        if (!categoryName) return;
        let data = this.getData();
        data.categoryInterests[categoryName] = (data.categoryInterests[categoryName] || 0) + 2; // Weight clicks higher
        this.saveData(data);
        this.syncWithServer();
    },

    /**
     * Get the top N user interests (categories)
     */
    getTopCategories: function(limit = 3) {
        let data = this.getData();
        return Object.entries(data.categoryInterests)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(entry => entry[0]);
    },

    /**
     * Get the top N user interests (badges)
     */
    getTopBadges: function(limit = 5) {
        let data = this.getData();
        return Object.entries(data.badgeInterests)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(entry => entry[0]);
    }
};

// Initialize globally
window.analyticsService = analyticsService;
analyticsService.init();
