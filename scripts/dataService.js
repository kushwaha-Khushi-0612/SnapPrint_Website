/**
 * Data Service
 * Centralized service to fetch and filter the unified products.json database.
 */

const dataService = {
    productsDB: null,
    cachedAllProducts: null,
    cachedHomepageProducts: null,

    init: async function () {
        if (this.productsDB) return this.productsDB;

        // Try getting from sessionStorage
        try {
            const cached = sessionStorage.getItem('snapprint_products_db_cache_v3');
            if (cached) {
                this.productsDB = JSON.parse(cached);
                return this.productsDB;
            }
        } catch (e) {
            console.warn('[DataService] Failed to read from sessionStorage:', e);
        }

        try {
            const response = await fetch('data/products.json');
            this.productsDB = await response.json();
            
            // Save to sessionStorage
            try {
                sessionStorage.setItem('snapprint_products_db_cache_v3', JSON.stringify(this.productsDB));
            } catch (e) {
                console.warn('[DataService] Failed to write to sessionStorage:', e);
            }

            return this.productsDB;
        } catch (error) {
            console.error('Failed to load products.json:', error);
            return null;
        }
    },

    getHomepageProductsFlattened: async function () {
        if (this.cachedHomepageProducts) return this.cachedHomepageProducts;

        // Try getting from sessionStorage
        try {
            const cached = sessionStorage.getItem('snapprint_homepage_products_cache_v3');
            if (cached) {
                this.cachedHomepageProducts = JSON.parse(cached);
                return this.cachedHomepageProducts;
            }
        } catch (e) {
            console.warn('[DataService] Failed to read homepage cache from sessionStorage:', e);
        }

        let homeProds = [];
        try {
            const response = await fetch('data/products_homepage.json');
            if (response.ok) {
                homeProds = await response.json();
                console.log('[DataService] Loaded lightweight homepage products database.');
            }
        } catch (e) {
            console.warn('[DataService] Failed to fetch products_homepage.json:', e);
        }

        if (!homeProds || homeProds.length === 0) {
            console.log('[DataService] Homepage products cache empty or failed, falling back to full products list.');
            homeProds = await this.getAllProductsFlattened();
        }

        this.cachedHomepageProducts = homeProds;

        try {
            sessionStorage.setItem('snapprint_homepage_products_cache_v3', JSON.stringify(homeProds));
        } catch (e) {
            console.warn('[DataService] Failed to write homepage cache to sessionStorage:', e);
        }

        return homeProds;
    },

    getAllProductsFlattened: async function () {
        if (this.cachedAllProducts) return this.cachedAllProducts;

        // Try getting from sessionStorage
        try {
            const cached = sessionStorage.getItem('snapprint_flat_products_cache_v3');
            if (cached) {
                this.cachedAllProducts = JSON.parse(cached);
                
                // Still trigger validateAndPrune after loading from cache
                if (window.wishlistService && window.wishlistService.validateAndPrune) {
                    await this.init(); // Make sure productsDB is loaded
                    const validProductIds = this.cachedAllProducts.map(p => String(p.id));
                    const validSubcategoryIds = [];
                    if (this.productsDB && this.productsDB.categories) {
                        this.productsDB.categories.forEach(cat => {
                            if (cat.sections) {
                                cat.sections.forEach(sec => {
                                    if (sec.subcategories) {
                                        sec.subcategories.forEach(sub => {
                                            validSubcategoryIds.push(String(sub.id));
                                        });
                                    }
                                });
                            }
                            if (cat.subcategories) {
                                cat.subcategories.forEach(sub => {
                                    validSubcategoryIds.push(String(sub.id));
                                });
                            }
                        });
                    }
                    window.wishlistService.validateAndPrune(validProductIds, validSubcategoryIds);
                }

                return this.cachedAllProducts;
            }
        } catch (e) {
            console.warn('[DataService] Failed to read flat cache from sessionStorage:', e);
        }

        await this.init();

        let allProds = [];

        // 1. Try to fetch the single pre-flattened products database first for ultra-fast loading
        try {
            const response = await fetch('data/products_all.json');
            if (response.ok) {
                allProds = await response.json();
                console.log('[DataService] Successfully loaded pre-flattened products database in 1 request.');
            }
        } catch (e) {
            console.warn('[DataService] Failed to fetch products_all.json, falling back to dynamic compile:', e);
        }

        // 2. Dynamic compile fallback (if products_all.json is not found or empty)
        if (!allProds || allProds.length === 0) {
            allProds = [];
            const fetchPromises = [];

            this.productsDB.categories.forEach(cat => {
                const processSubcategories = (subs, parentSection) => {
                    subs.forEach(sub => {
                        if (sub.dataFile) {
                            // Fetch the external product data file
                            const fetchPromise = fetch(sub.dataFile)
                                .then(res => res.json())
                                .then(products => {
                                    if (!Array.isArray(products)) {
                                        console.warn(`Data from ${sub.dataFile} is not an array:`, products);
                                        return;
                                    }
                                    products.forEach(p => {
                                        p.categoryName = cat.name;
                                        p.subcategoryName = sub.name;
                                        p.subcategoryId = sub.id;
                                        p.parentSection = parentSection;

                                        // Normalize image path
                                        if (!p.image && p.baseImagePath && p.images && p.images.length > 0) {
                                            p.image = p.baseImagePath + p.images[0];
                                        } else if (!p.image) {
                                            p.image = 'constants/products/placeholder.jpg';
                                        }

                                        // Dynamically assign Collections based on attributes
                                        p.collections = ['Mega Print Festival']; // All get this
                                        const discount = p.originalPrice ? ((p.originalPrice - p.price) / p.originalPrice) * 100 : 0;
                                        if (discount >= 40 || p.badge === 'Sale') p.collections.push('Flash Sales');
                                        if (discount >= 30) p.collections.push('Deals');
                                        if (p.rating >= 4.5 || p.badge === 'Bestseller') p.collections.push('Top Selection');
                                        if (['Decor', 'Photo Frames', 'Jewelry', 'Key Chains', 'Mugs & Cups'].includes(cat.name)) p.collections.push('Occasions');
                                        if (["Men's Special", "Women's Special", "Kids Clothing", "T-Shirts"].includes(cat.name) || ["Men's Special", "Women's Special"].includes(sub.name)) p.collections.push('Heart Winning T-Shirts');
                                        if (["Face Masks", "Key Chains", "Jewelry", "Decor"].includes(cat.name)) p.collections.push('Trendy Accessories');
                                        if (cat.name === 'Hoodies' && (parentSection === 'Women Clothing' || sub.name.includes("Women"))) p.collections.push("Women's Custom Wear");
                                        if (cat.name === 'Hoodies' && (parentSection === 'Men Clothing' || sub.name.includes("Men"))) p.collections.push("Men's Urban Streetwear");

                                        p.link = `productDetails.html?id=${p.id}`;
                                        allProds.push(p);
                                    });
                                })
                                .catch(err => console.error(`Failed to load ${sub.dataFile}:`, err));
                            fetchPromises.push(fetchPromise);
                        } else if (sub.products) {
                            // Handle legacy embedded products if any
                            sub.products.forEach(p => {
                                p.categoryName = cat.name;
                                p.subcategoryName = sub.name;
                                p.subcategoryId = sub.id;
                                p.parentSection = parentSection;
                                if (!p.image && p.baseImagePath && p.images && p.images.length > 0) {
                                    p.image = p.baseImagePath + p.images[0];
                                }
                                p.link = `productDetails.html?id=${p.id}`;
                                allProds.push(p);
                            });
                        }
                    });
                };

                if (cat.sections) {
                    cat.sections.forEach(section => processSubcategories(section.subcategories, section.name));
                } else if (cat.subcategories) {
                    processSubcategories(cat.subcategories, cat.name);
                }
            });

            // Wait for all external files to be loaded
            await Promise.all(fetchPromises);
        }

        this.cachedAllProducts = allProds;

        // Save to sessionStorage
        try {
            sessionStorage.setItem('snapprint_flat_products_cache_v2', JSON.stringify(allProds));
        } catch (e) {
            console.warn('[DataService] Failed to write flat cache to sessionStorage:', e);
        }

        // Auto-prune wishlist
        if (window.wishlistService && window.wishlistService.validateAndPrune) {
            const validProductIds = allProds.map(p => String(p.id));
            const validSubcategoryIds = [];
            this.productsDB.categories.forEach(cat => {
                if (cat.sections) {
                    cat.sections.forEach(sec => {
                        if (sec.subcategories) {
                            sec.subcategories.forEach(sub => {
                                validSubcategoryIds.push(String(sub.id));
                            });
                        }
                    });
                }
                if (cat.subcategories) {
                    cat.subcategories.forEach(sub => {
                        validSubcategoryIds.push(String(sub.id));
                    });
                }
            });
            window.wishlistService.validateAndPrune(validProductIds, validSubcategoryIds);
        }

        return allProds;
    },

    getProductsBySubcategory: async function (subId) {
        await this.init();
        let subData = null;

        this.productsDB.categories.forEach(cat => {
            const findSub = (subs) => subs.find(s => s.id === subId);
            if (cat.sections) {
                cat.sections.forEach(sec => {
                    const found = findSub(sec.subcategories);
                    if (found) subData = found;
                });
            } else if (cat.subcategories) {
                const found = findSub(cat.subcategories);
                if (found) subData = found;
            }
        });

        if (subData && subData.dataFile) {
            try {
                const response = await fetch(subData.dataFile);
                return await response.json();
            } catch (e) {
                console.error("Failed to fetch subcategory data:", e);
                return [];
            }
        }
        return subData ? (subData.products || []) : [];
    },

    getProductsByCategory: async function (categoryName) {
        // Try getting from cached homepage products first for blazing speed!
        const homepageProds = await this.getHomepageProductsFlattened();
        const normalizedTarget = categoryName.replace(/[-\s]/g, '').toLowerCase();
        
        if (homepageProds && homepageProds.length > 0) {
            const filtered = homepageProds.filter(p => {
                const pCat = p.categoryName || p.category || '';
                return pCat.replace(/[-\s]/g, '').toLowerCase() === normalizedTarget;
            });
            if (filtered.length > 0) {
                return filtered;
            }
        }

        await this.init();

        const cat = this.productsDB.categories.find(c => {
            const normalizedName = c.name.replace(/[-\s]/g, '').toLowerCase();
            return normalizedName === normalizedTarget;
        });

        if (!cat) return [];

        let categoryProds = [];
        const fetchPromises = [];

        const processSubcategories = (subs, parentSection) => {
            subs.forEach(sub => {
                if (sub.dataFile) {
                    const fetchPromise = fetch(sub.dataFile)
                        .then(res => res.json())
                        .then(products => {
                            if (!Array.isArray(products)) return;
                            products.forEach(p => {
                                p.categoryName = cat.name;
                                p.subcategoryName = sub.name;
                                p.subcategoryId = sub.id;
                                p.parentSection = parentSection;
                                if (!p.image && p.baseImagePath && p.images && p.images.length > 0) {
                                    p.image = p.baseImagePath + p.images[0];
                                } else if (!p.image) {
                                    p.image = 'constants/products/placeholder.jpg';
                                }

                                // Dynamically assign Collections based on attributes
                                p.collections = ['Mega Print Festival'];
                                const discount = p.originalPrice ? ((p.originalPrice - p.price) / p.originalPrice) * 100 : 0;
                                if (discount >= 40 || p.badge === 'Sale') p.collections.push('Flash Sales');
                                if (discount >= 30) p.collections.push('Deals');
                                if (p.rating >= 4.5 || p.badge === 'Bestseller') p.collections.push('Top Selection');
                                if (['Decor', 'Photo Frames', 'Jewelry', 'Key Chains', 'Mugs & Cups'].includes(cat.name)) p.collections.push('Occasions');
                                if (["Men's Special", "Women's Special", "Kids Clothing", "T-Shirts"].includes(cat.name) || ["Men's Special", "Women's Special"].includes(sub.name)) p.collections.push('Heart Winning T-Shirts');
                                if (["Face Masks", "Key Chains", "Jewelry", "Decor"].includes(cat.name)) p.collections.push('Trendy Accessories');
                                if (cat.name === 'Hoodies' && (parentSection === 'Women Clothing' || sub.name.includes("Women"))) p.collections.push("Women's Custom Wear");
                                if (cat.name === 'Hoodies' && (parentSection === 'Men Clothing' || sub.name.includes("Men"))) p.collections.push("Men's Urban Streetwear");

                                p.link = `productDetails.html?id=${p.id}`;
                                categoryProds.push(p);
                            });
                        })
                        .catch(err => console.error(`Failed to load ${sub.dataFile}:`, err));
                    fetchPromises.push(fetchPromise);
                } else if (sub.products) {
                    sub.products.forEach(p => {
                        p.categoryName = cat.name;
                        p.subcategoryName = sub.name;
                        p.subcategoryId = sub.id;
                        p.parentSection = parentSection;
                        p.link = `productDetails.html?id=${p.id}`;
                        categoryProds.push(p);
                    });
                }
            });
        };

        if (cat.sections) {
            cat.sections.forEach(section => processSubcategories(section.subcategories, section.name));
        } else if (cat.subcategories) {
            processSubcategories(cat.subcategories, cat.name);
        }

        await Promise.all(fetchPromises);
        return categoryProds;
    },

    /**
     * Get products based on user interests
     */
    getRecommendedProducts: async function (count = 8) {
        const all = await this.getHomepageProductsFlattened();
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
            const needed = count - recommended.length;
            const available = all.filter(p => !recommended.find(r => r.id === p.id));
            const randoms = [];
            const used = new Set();
            while (randoms.length < needed && used.size < available.length) {
                const idx = Math.floor(Math.random() * available.length);
                if (!used.has(idx)) {
                    used.add(idx);
                    randoms.push(available[idx]);
                }
            }
            recommended = recommended.concat(randoms);
        }

        // Shuffle recommended slightly
        return recommended.sort(() => 0.5 - Math.random()).slice(0, count);
    },

    /**
     * Get products from user's view history
     */
    getRecentlyViewedProducts: async function (count = 6) {
        const historyIds = window.analyticsService ? window.analyticsService.getData().viewHistory : [];
        if (historyIds.length === 0) return [];

        const promises = historyIds.slice(0, count).map(id => this.getProductById(id));
        const results = await Promise.all(promises);
        return results.filter(p => p);
    },

    /**
     * Get random products across categories
     */
    getRandomProducts: async function (count = 6) {
        const all = await this.getHomepageProductsFlattened();
        const result = [];
        const max = all.length;
        if (max === 0) return result;
        const used = new Set();
        while (result.length < count && used.size < max) {
            const idx = Math.floor(Math.random() * max);
            if (!used.has(idx)) {
                used.add(idx);
                result.push(all[idx]);
            }
        }
        return result;
    },

    getProductById: async function (id) {
        // 1. If already cached in memory, return it instantly
        if (this.cachedAllProducts) {
            const found = this.cachedAllProducts.find(p => p.id === id);
            if (found) return found;
        }

        // 2. Try getting from sessionStorage cache
        try {
            const cached = sessionStorage.getItem('snapprint_flat_products_cache_v2');
            if (cached) {
                const parsed = JSON.parse(cached);
                const found = parsed.find(p => p.id === id);
                if (found) return found;
            }
        } catch (e) {
            console.warn('[DataService] Error checking flat cache for product:', e);
        }

        // 2.5 Try getting from homepage products cache (very fast!)
        if (this.cachedHomepageProducts) {
            const found = this.cachedHomepageProducts.find(p => p.id === id);
            if (found) return found;
        }
        try {
            const cachedHome = sessionStorage.getItem('snapprint_homepage_products_cache_v2');
            if (cachedHome) {
                const parsed = JSON.parse(cachedHome);
                const found = parsed.find(p => p.id === id);
                if (found) return found;
            }
        } catch (e) {
            console.warn('[DataService] Error checking homepage cache for product:', e);
        }

        // 3. Heuristic subcategory target matching (blazing fast fallback!)
        await this.init(); // Make sure products index is loaded
        if (this.productsDB && this.productsDB.categories) {
            const lowerId = id.toLowerCase();
            const candidates = [];

            const processSectionList = (cat) => {
                if (cat.sections) {
                    cat.sections.forEach(sec => {
                        if (sec.subcategories) {
                            sec.subcategories.forEach(sub => {
                                const subIdNorm = sub.id.toLowerCase().replace(/[^a-z0-9]/g, '');
                                const subNameNorm = sub.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                                const secNorm = sec.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                                const catNameNorm = cat.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                                
                                let score = 0;
                                if (lowerId.includes(subIdNorm)) score += 100;
                                if (lowerId.includes(subNameNorm)) score += 50;
                                if (lowerId.includes(catNameNorm)) score += 20;
                                if (secNorm && lowerId.includes(secNorm)) score += 20;

                                if (score >= 50) {
                                    candidates.push({ sub, score, cat, parentSection: sec.name });
                                }
                            });
                        }
                    });
                } else if (cat.subcategories) {
                    cat.subcategories.forEach(sub => {
                        const subIdNorm = sub.id.toLowerCase().replace(/[^a-z0-9]/g, '');
                        const subNameNorm = sub.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                        const catNameNorm = cat.name.toLowerCase().replace(/[^a-z0-9]/g, '');

                        let score = 0;
                        if (lowerId.includes(subIdNorm)) score += 100;
                        if (lowerId.includes(subNameNorm)) score += 50;
                        if (lowerId.includes(catNameNorm)) score += 20;

                        if (score >= 50) {
                            candidates.push({ sub, score, cat, parentSection: '' });
                        }
                    });
                }
            };

            this.productsDB.categories.forEach(processSectionList);

            // Sort candidates by highest match score
            candidates.sort((a, b) => b.score - a.score);

            // Fetch candidate files in parallel (usually only 1 or 2 files match)
            if (candidates.length > 0) {
                const targetFetches = candidates.slice(0, 3).map(async (c) => {
                    if (!c.sub.dataFile) return null;
                    try {
                        const response = await fetch(c.sub.dataFile);
                        if (response.ok) {
                            const products = await response.json();
                            const match = products.find(p => p.id === id);
                            if (match) {
                                // Add metadata
                                match.categoryName = c.cat.name;
                                match.subcategoryName = c.sub.name;
                                match.subcategoryId = c.sub.id;
                                if (c.parentSection) match.parentSection = c.parentSection;
                                if (!match.image && match.baseImagePath && match.images && match.images.length > 0) {
                                    match.image = match.baseImagePath + match.images[0];
                                } else if (!match.image) {
                                    match.image = 'constants/products/placeholder.jpg';
                                }
                                match.link = `productDetails.html?id=${match.id}`;
                                return match;
                            }
                        }
                    } catch (e) {
                        console.warn(`[DataService] Failed to load candidate subcategory file ${c.sub.dataFile}:`, e);
                    }
                    return null;
                });

                const results = await Promise.all(targetFetches);
                const foundProduct = results.find(p => p !== null);
                if (foundProduct) return foundProduct;
            }
        }

        // 4. Ultimate fallback: Fetch everything if heuristics failed
        const all = await this.getAllProductsFlattened();
        return all.find(p => p.id === id) || null;
    }
};

window.dataService = dataService;
