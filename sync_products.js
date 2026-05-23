const fs = require('fs');
const path = require('path');

const PRODUCTS_DB_PATH = 'data/products.json';
const NN_PATH = 'nn.json';
const CONSTANTS_DIR = path.join('constants', 'products');
const OLD_DATA_DIR = 'data/products';

/**
 * Syncs products.json and maintains subcategory-localized product files
 */
function syncAndMigrate() {
    console.log('Migrating product data to localized subcategory folders...');
    const productsDB = JSON.parse(fs.readFileSync(PRODUCTS_DB_PATH, 'utf8'));
    const nnData = JSON.parse(fs.readFileSync(NN_PATH, 'utf8'));

    const categories = fs.readdirSync(CONSTANTS_DIR);

    const newCategories = categories.map(catFolderName => {
        const catPath = path.join(CONSTANTS_DIR, catFolderName);
        if (!fs.lstatSync(catPath).isDirectory()) return null;

        const isSpecial = ['T-Shirts', 'Hoodies'].includes(catFolderName);
        const catId = 'cat-' + catFolderName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const existingCat = (productsDB.categories || []).find(c => c.id === catId || c.name === catFolderName);

        const result = {
            id: catId,
            name: catFolderName,
            ...existingCat
        };

        const processSubcategories = (subs, parentSection, subDirPath) => {
            return subs.map(subName => {
                const subPath = path.join(subDirPath, subName);
                const subId = parentSection 
                    ? `sub-${parentSection.toLowerCase().replace(/[^a-z0-9]/g, '')}-${subName.toLowerCase().replace(/[^a-z0-9]/g, '')}`
                    : `sub-${subName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
                
                // New localized JSON path
                const localizedJsonName = 'products.json';
                const localizedJsonPath = path.join(subPath, localizedJsonName);
                
                // Old JSON path (for migration)
                const oldJsonPath = path.join(OLD_DATA_DIR, `product_${subId}.json`);

                let products = [];
                
                // Try to load from localized JSON first, then old data dir
                if (fs.existsSync(localizedJsonPath)) {
                    products = JSON.parse(fs.readFileSync(localizedJsonPath, 'utf8'));
                } else if (fs.existsSync(oldJsonPath)) {
                    products = JSON.parse(fs.readFileSync(oldJsonPath, 'utf8'));
                }

                // Rule: Refresh placeholders if needed
                if (products.length === 0 || products.some(p => p.baseImagePath)) {
                    products = generatePlaceholderProducts(catFolderName, subName, subId);
                }

                // Save products to localized file
                fs.writeFileSync(localizedJsonPath, JSON.stringify(products, null, 4));

                // Load custom images map if not loaded
                let customImageMap = {};
                try {
                    customImageMap = JSON.parse(fs.readFileSync('data/mens_special_images.json', 'utf8'));
                } catch(e) {}

                let finalSubImage = (products.length > 0) ? (products[0].image || '') : '';
                if (customImageMap[subName]) {
                    finalSubImage = customImageMap[subName];
                }

                return {
                    id: subId,
                    name: subName,
                    image: finalSubImage,
                    description: `${subName} ${catFolderName} ${parentSection ? 'for ' + parentSection : ''}`,
                    productCount: `${products.length}+`,
                    dataFile: localizedJsonPath.replace(/\\/g, '/') // Use forward slashes for web fetch
                };
            });
        };

        if (isSpecial) {
            result.sections = ['Men Clothing', 'Women Clothing'].map(secName => {
                const secPath = path.join(catPath, secName);
                if (!fs.existsSync(secPath)) fs.mkdirSync(secPath, { recursive: true });
                const subs = fs.readdirSync(secPath).filter(s => fs.lstatSync(path.join(secPath, s)).isDirectory());
                return {
                    name: secName,
                    subcategories: processSubcategories(subs, secName, secPath)
                };
            });
            delete result.subcategories;
        } else {
            const subs = fs.readdirSync(catPath).filter(s => fs.lstatSync(path.join(catPath, s)).isDirectory());
            result.subcategories = processSubcategories(subs, null, catPath);
            delete result.sections;
        }

        return result;
    }).filter(c => c !== null);

    productsDB.categories = newCategories;
    fs.writeFileSync(PRODUCTS_DB_PATH, JSON.stringify(productsDB, null, 4));
    
    console.log('Localized product architecture enforced successfully.');
    
    // Generate unified products_all.json
    console.log('Generating unified products_all.json...');
    const allProducts = [];
    newCategories.forEach(cat => {
        const process = (subs, parentSection) => {
            subs.forEach(sub => {
                const subPath = parentSection
                    ? path.join(CONSTANTS_DIR, cat.name, parentSection, sub.name)
                    : path.join(CONSTANTS_DIR, cat.name, sub.name);
                const localizedJsonPath = path.join(subPath, 'products.json');
                if (fs.existsSync(localizedJsonPath)) {
                    try {
                        const products = JSON.parse(fs.readFileSync(localizedJsonPath, 'utf8'));
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
                            
                            // Add collections attributes dynamically
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
                            allProducts.push(p);
                        });
                    } catch (e) {
                        console.error('Failed to parse ' + localizedJsonPath, e);
                    }
                }
            });
        };
        if (cat.sections) {
            cat.sections.forEach(sec => process(sec.subcategories, sec.name));
        } else if (cat.subcategories) {
            process(cat.subcategories, null);
        }
    });
    
    const dataDir = path.dirname(PRODUCTS_DB_PATH);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(path.join(dataDir, 'products_all.json'), JSON.stringify(allProducts, null, 4));
    console.log(`Unified products_all.json generated successfully with ${allProducts.length} products.`);

    // Generate curated products_homepage.json
    console.log('Generating curated products_homepage.json...');
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
        const sorted = [...list].sort((a, b) => {
            const aScore = (a.badge ? 2 : 0) + parseFloat(a.rating || 4.0);
            const bScore = (b.badge ? 2 : 0) + parseFloat(b.rating || 4.0);
            return bScore - aScore;
        });
        const topProds = sorted.slice(0, 2);
        homepageProducts.push(...topProds);
    });

    fs.writeFileSync(path.join(dataDir, 'products_homepage.json'), JSON.stringify(homepageProducts, null, 4));
    console.log(`Curated products_homepage.json generated successfully with ${homepageProducts.length} products.`);

    // Optional: Clean up the old data directory
    if (fs.existsSync(OLD_DATA_DIR)) {
        console.log('Cleaning up legacy data directory...');
        // Only delete if it's the specific products folder we were using
        fs.rmSync(OLD_DATA_DIR, { recursive: true, force: true });
    }
}

function generatePlaceholderProducts(catName, subName, subId) {
    const products = [];
    let customImage = `https://picsum.photos/seed/${subId}/400/400`;
    try {
        const fs = require('fs');
        const imgMap = JSON.parse(fs.readFileSync('data/mens_special_images.json', 'utf8'));
        if (imgMap[subName]) customImage = imgMap[subName];
    } catch(e) {}

    for (let i = 1; i <= 8; i++) {
        products.push({
            id: `p-${subId}-${i}`,
            title: `${subName} ${catName} Sample ${i}`,
            price: 599,
            originalPrice: 1199,
            image: i === 1 ? customImage : `https://picsum.photos/seed/${subId}${i}/400/400`,
            rating: "4.2",
            reviewCount: Math.floor(Math.random() * 200) + 20,
            color: "White",
            availableSizes: ["S", "M", "L", "XL"],
            badge: i % 3 === 0 ? "Bestseller" : (i % 4 === 0 ? "New Arrival" : null),
            can_beCustomised: 1
        });
    }
    return products;
}

try {
    syncAndMigrate();
} catch (err) {
    console.error('Migration failed:', err);
}
