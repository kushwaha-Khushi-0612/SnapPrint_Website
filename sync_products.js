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

                // Rule: If it's V-Neck, always update from nn.json
                if (subName.toLowerCase().includes('v neck')) {
                     products = nnData.map((item, index) => ({
                        id: `p-vneck-${index}`,
                        sku_id: `SKU-VN${index}`,
                        title: item.name,
                        description: `Premium quality V-Neck T-Shirt. ${item.name}`,
                        price: parseInt(item.sellingPrice) || 499,
                        originalPrice: parseInt(item.markedPrice) || 998,
                        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                        reviewCount: Math.floor(Math.random() * 500) + 10,
                        color: (item.colors && item.colors.length > 0) ? item.colors[0] : "White",
                        availableSizes: ["S", "M", "L", "XL"],
                        badge: item.discount ? `${item.discount} OFF` : null,
                        image: item.image,
                        can_beCustomised: 1
                     }));
                } 
                // Rule: Refresh placeholders if needed
                else if (products.length === 0 || products.some(p => p.baseImagePath)) {
                    products = generatePlaceholderProducts(catFolderName, subName, subId);
                }

                // Save products to localized file
                fs.writeFileSync(localizedJsonPath, JSON.stringify(products, null, 4));

                return {
                    id: subId,
                    name: subName,
                    image: (products.length > 0) ? (products[0].image || '') : '',
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
    
    // Optional: Clean up the old data directory
    if (fs.existsSync(OLD_DATA_DIR)) {
        console.log('Cleaning up legacy data directory...');
        // Only delete if it's the specific products folder we were using
        fs.rmSync(OLD_DATA_DIR, { recursive: true, force: true });
    }
}

function generatePlaceholderProducts(catName, subName, subId) {
    const products = [];
    for (let i = 1; i <= 8; i++) {
        products.push({
            id: `p-${subId}-${i}`,
            title: `${subName} ${catName} Sample ${i}`,
            price: 599,
            originalPrice: 1199,
            image: `https://picsum.photos/seed/${subId}${i}/400/400`,
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
