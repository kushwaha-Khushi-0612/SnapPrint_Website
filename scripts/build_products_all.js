const fs = require('fs');
const path = require('path');

const PRODUCTS_DB_PATH = path.join(__dirname, '..', 'data', 'products.json');
const PRODUCTS_ALL_PATH = path.join(__dirname, '..', 'data', 'products_all.json');

function buildAllProducts() {
    console.log('Starting unified products compilation...');
    if (!fs.existsSync(PRODUCTS_DB_PATH)) {
        console.error(`Error: Products DB index not found at ${PRODUCTS_DB_PATH}`);
        return;
    }

    const productsDB = JSON.parse(fs.readFileSync(PRODUCTS_DB_PATH, 'utf8'));
    const allProducts = [];

    productsDB.categories.forEach(cat => {
        const processSubcategories = (subs, parentSection) => {
            subs.forEach(sub => {
                if (!sub.dataFile) return;

                const dataFilePath = path.join(__dirname, '..', sub.dataFile);
                if (fs.existsSync(dataFilePath)) {
                    try {
                        const products = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
                        products.forEach(p => {
                            p.categoryName = cat.name;
                            p.subcategoryName = sub.name;
                            p.subcategoryId = sub.id;
                            if (parentSection) p.parentSection = parentSection;

                            // Normalize image path
                            if (!p.image && p.baseImagePath && p.images && p.images.length > 0) {
                                p.image = p.baseImagePath + p.images[0];
                            } else if (!p.image) {
                                p.image = 'constants/products/placeholder.jpg';
                            }

                            // Dynamic collections
                            p.collections = ['Mega Print Festival'];
                            const discount = p.originalPrice ? ((p.originalPrice - p.price) / p.originalPrice) * 100 : 0;
                            if (discount >= 40 || p.badge === 'Sale') p.collections.push('Flash Sales');
                            if (discount >= 30) p.collections.push('Deals');
                            if (p.rating >= 4.5 || p.badge === 'Bestseller') p.collections.push('Top Selection');
                            if (['Decor', 'Photo Frames', 'Jewelry', 'Key Chains', 'Mugs and Sippers'].includes(cat.name)) p.collections.push('Occasions');
                            if (["Men's Special", "Women's Special", "Kids Clothing", "T-Shirts"].includes(cat.name) || ["Men's Special", "Women's Special"].includes(sub.name)) p.collections.push('Heart Winning T-Shirts');
                            if (["Face Masks", "Key Chains", "Jewelry", "Decor"].includes(cat.name)) p.collections.push('Trendy Accessories');
                            if (cat.name === 'Hoodies' && (parentSection === 'Women Clothing' || sub.name.includes("Women"))) p.collections.push("Women's Custom Wear");
                            if (cat.name === 'Hoodies' && (parentSection === 'Men Clothing' || sub.name.includes("Men"))) p.collections.push("Men's Urban Streetwear");

                            p.link = `productDetails.html?id=${p.id}`;
                            allProducts.push(p);
                        });
                    } catch (e) {
                        console.error(`Failed to parse file: ${dataFilePath}`, e);
                    }
                } else {
                    console.warn(`File not found: ${dataFilePath}`);
                }
            });
        };

        if (cat.sections) {
            cat.sections.forEach(sec => processSubcategories(sec.subcategories, sec.name));
        } else if (cat.subcategories) {
            processSubcategories(cat.subcategories, null);
        }
    });

    fs.writeFileSync(PRODUCTS_ALL_PATH, JSON.stringify(allProducts, null, 4));
    console.log(`Successfully compiled unified products database!`);
    console.log(`Total products compiled: ${allProducts.length}`);

    // Compile a highly diverse and curated subset for fast homepage and detail page loads
    const homepageProducts = [];
    const subcategoryGroups = {};

    allProducts.forEach(p => {
        const subId = p.subcategoryId;
        if (!subcategoryGroups[subId]) {
            subcategoryGroups[subId] = [];
        }
        subcategoryGroups[subId].push(p);
    });

    Object.keys(subcategoryGroups).forEach(subId => {
        const list = subcategoryGroups[subId];
        // Sort products: Prioritize any badge and higher rating
        const sorted = [...list].sort((a, b) => {
            const aScore = (a.badge ? 2 : 0) + parseFloat(a.rating || 4.0);
            const bScore = (b.badge ? 2 : 0) + parseFloat(b.rating || 4.0);
            return bScore - aScore;
        });
        // Take at most 6 products per subcategory
        const topProds = sorted.slice(0, 6);
        homepageProducts.push(...topProds);
    });

    const PRODUCTS_HOMEPAGE_PATH = path.join(__dirname, '..', 'data', 'products_homepage.json');
    fs.writeFileSync(PRODUCTS_HOMEPAGE_PATH, JSON.stringify(homepageProducts, null, 4));
    console.log(`Successfully compiled curated homepage database!`);
    console.log(`Total curated products compiled: ${homepageProducts.length}`);
}

buildAllProducts();
