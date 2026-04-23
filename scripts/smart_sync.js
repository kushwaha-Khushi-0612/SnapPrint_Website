const fs = require('fs');
const path = require('path');

const NN_PATH = 'nn.json';
const MASTER_PRODUCTS_PATH = 'data/products.json';

/**
 * Intelligent mapping of product details
 */
function intelligentMap(item, index, subcategoryName, idPrefix) {
    const sellingPrice = parseInt(item.sellingPrice) || 499;
    const markedPrice = parseInt(item.markedPrice) || 998;
    const discountVal = item.discount ? parseInt(item.discount.replace('%', '')) : 0;
    
    let badge = item.discount ? `${item.discount} OFF` : null;
    let status = "";
    
    // Rule: if more than 50% then special and occasional
    if (discountVal > 50) {
        status = "Special Offer";
    }
    if (discountVal > 65) {
        status = "Limited Deal";
    }
    
    const nameLower = item.name.toLowerCase();
    let description = `Premium quality ${subcategoryName} product. ${item.name}`;
    
    // Keyword based descriptions - ordered by specificity (last one wins)
    if (nameLower.includes('half sleeve')) description = `Classic half-sleeve ${subcategoryName} T-Shirt, perfect for everyday wear. ${item.name}`;
    if (nameLower.includes('full sleeve')) description = `Comfortable full-sleeve ${subcategoryName} T-Shirt, ideal for cooler weather. ${item.name}`;
    if (nameLower.includes('v neck') || nameLower.includes('v-neck')) description = `Stylish V-neck ${subcategoryName} T-Shirt for a sharp, modern appearance. ${item.name}`;
    if (nameLower.includes('henley')) description = `Premium Henley neck ${subcategoryName} T-Shirt with a sophisticated button placket. ${item.name}`;
    if (nameLower.includes('oversized')) description = `Relaxed fit oversized ${subcategoryName} T-Shirt for a modern street-style look. ${item.name}`;

    // Intelligent tags system
    const tags = [];
    if (nameLower.includes('customized')) tags.push('Customizable');
    if (nameLower.includes('printed')) tags.push('Printed');
    if (nameLower.includes('half sleeve')) tags.push('Half Sleeve');
    if (nameLower.includes('full sleeve')) tags.push('Full Sleeve');
    if (nameLower.includes('oversized')) tags.push('Oversized');
    if (nameLower.includes('men')) tags.push('Men');
    if (nameLower.includes('women')) tags.push('Women');
    if (discountVal > 55) tags.push('Trending');
    if (discountVal > 70) tags.push('Clearance');
    
    // Extract color from colors array or name
    let primaryColor = (item.colors && item.colors.length > 0) ? item.colors[0] : "Free Color";
    if (primaryColor === "Free Color" && nameLower.split(' ')[0]) {
        // Try to guess color from first word if it's common
        const commonColors = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'maroon', 'navy', 'grey'];
        const firstWord = nameLower.split(' ')[0];
        if (commonColors.includes(firstWord)) {
            primaryColor = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
        }
    }

    return {
        id: `${idPrefix}-${index}`,
        sku_id: `SKU-${idPrefix.toUpperCase().replace(/-/g, '')}${index}`,
        title: item.name,
        description: description,
        price: sellingPrice,
        originalPrice: markedPrice,
        rating: (Math.random() * (5.0 - 3.9) + 3.9).toFixed(1), 
        reviewCount: Math.floor(Math.random() * 800) + 50,
        color: primaryColor,
        availableSizes: ["S", "M", "L", "XL", "XXL"],
        badge: badge,
        image: item.image,
        can_beCustomised: nameLower.includes('customized') ? 1 : 0,
        tags: tags,
        status: status,
        features: {
            fabric: nameLower.includes('cotton') ? "100% Cotton" : "Premium Blend",
            fit: nameLower.includes('oversized') ? "Oversized Fit" : (nameLower.includes('slim') ? "Slim Fit" : "Regular Fit"),
            sleeve: nameLower.includes('full') ? "Full Sleeve" : "Half Sleeve",
            pattern: nameLower.includes('printed') ? "Graphic Print" : "Solid"
        }
    };
}

/**
 * Main Sync Function
 */
function syncSubcategory(keyword, targetFolder, idPrefix) {
    console.log(`\n--- Smart Syncing for: ${keyword} ---`);
    
    if (!fs.existsSync(NN_PATH)) {
        console.error("Error: nn.json not found in root directory.");
        return;
    }

    let nnData = JSON.parse(fs.readFileSync(NN_PATH, 'utf8'));
    
    // Dedup nnData
    const seen = new Set();
    const originalCount = nnData.length;
    nnData = nnData.filter(item => {
        const key = `${item.name}-${item.image}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
    
    if (originalCount !== nnData.length) {
        console.log(`Deduped: Removed ${originalCount - nnData.length} duplicates from source.`);
    }

    // Filter items that match the keyword
    const filteredItems = nnData.filter(item => 
        item.name.toLowerCase().includes(keyword.toLowerCase())
    );

    if (filteredItems.length === 0) {
        console.warn(`Warning: No items found in nn.json matching keyword "${keyword}"`);
        return;
    }

    console.log(`Found ${filteredItems.length} matching items.`);

    const mappedProducts = filteredItems.map((item, idx) => 
        intelligentMap(item, idx, keyword, idPrefix)
    );

    // Ensure target folder exists and is clean
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });
    } else {
        const contents = fs.readdirSync(targetFolder);
        contents.forEach(item => {
            const itemPath = path.join(targetFolder, item);
            if (fs.lstatSync(itemPath).isDirectory()) {
                fs.rmSync(itemPath, { recursive: true, force: true });
            }
        });
    }

    const targetFilePath = path.join(targetFolder, 'products.json');
    fs.writeFileSync(targetFilePath, JSON.stringify(mappedProducts, null, 4));
    
    console.log(`Successfully generated: ${targetFilePath}`);
    updateMasterConfig(keyword, targetFolder, mappedProducts.length);
}

/**
 * Global Distribution Mode
 */
function syncAll(filterName = null) {
    console.log(`\n🚀 Starting ${filterName ? `Filtered ("${filterName}")` : 'Global'} Smart Distribution...`);
    
    if (!fs.existsSync(MASTER_PRODUCTS_PATH)) {
        console.error("Error: data/products.json not found.");
        return;
    }

    if (!fs.existsSync(NN_PATH)) {
        console.error("Error: nn.json not found.");
        return;
    }

    const productsDB = JSON.parse(fs.readFileSync(MASTER_PRODUCTS_PATH, 'utf8'));
    let nnData = JSON.parse(fs.readFileSync(NN_PATH, 'utf8'));
    
    // Dedup
    const seen = new Set();
    nnData = nnData.filter(item => {
        const key = `${item.name}-${item.image}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    console.log(`Source data: ${nnData.length} unique products.`);

    const subcategories = [];
    productsDB.categories.forEach(cat => {
        const collect = (subs) => {
            if (!subs) return;
            subs.forEach(s => {
                if (s.dataFile) {
                    subcategories.push({
                        name: s.name,
                        path: path.dirname(s.dataFile),
                        id: s.id || `p-${s.name.toLowerCase().replace(/\s+/g, '-')}`
                    });
                }
            });
        };
        if (cat.sections) {
            cat.sections.forEach(sec => collect(sec.subcategories));
        } else {
            collect(cat.subcategories);
        }
    });

    console.log(`Found ${subcategories.length} subcategories to check.`);

    let updatedCount = 0;

    subcategories.forEach(sub => {
        if (filterName && !sub.name.toLowerCase().includes(filterName.toLowerCase())) return;

        const keyword = sub.name.toLowerCase().replace(/s$/, ''); // base keyword
        const matches = nnData.filter(item => {
            const nameLower = item.name.toLowerCase();
            // Intelligent matching
            if (nameLower.includes(keyword)) return true;
            if (keyword === 'half sleeve' && nameLower.includes('half sleeve')) return true;
            if (keyword === 'half sleeve' && nameLower.includes('half sleeves')) return true;
            if (keyword === 'v neck' && (nameLower.includes('v neck') || nameLower.includes('v-neck'))) return true;
            return false;
        });

        if (matches.length > 0) {
            console.log(`Matching "${sub.name}": ${matches.length} products.`);
            
            const mapped = matches.map((item, idx) => 
                intelligentMap(item, idx, sub.name, sub.id)
            );

            const targetFolder = sub.path;
            if (!fs.existsSync(targetFolder)) {
                fs.mkdirSync(targetFolder, { recursive: true });
            }

            const targetFilePath = path.join(targetFolder, 'products.json');
            fs.writeFileSync(targetFilePath, JSON.stringify(mapped, null, 4));
            
            // Update the master config object in memory
            updateMasterConfigInMemory(productsDB, sub.name, targetFolder, mapped.length);
            updatedCount++;
        }
    });

    // Save master config
    fs.writeFileSync(MASTER_PRODUCTS_PATH, JSON.stringify(productsDB, null, 4));
    console.log(`\n✅ Global Sync Complete! Updated ${updatedCount} subcategories.`);
}

function updateMasterConfigInMemory(db, subcategoryName, targetFolder, count) {
    const dataFileRelative = targetFolder.replace(/\\/g, '/') + '/products.json';
    const normalizedInput = subcategoryName.toLowerCase().replace(/s$/, '');

    db.categories.forEach(cat => {
        const findAndUpdate = (subs) => {
            if (!subs) return;
            const sub = subs.find(s => {
                const normalizedSub = s.name.toLowerCase().replace(/s$/, '');
                return normalizedSub === normalizedInput || s.name.toLowerCase() === subcategoryName.toLowerCase();
            });
            if (sub) {
                sub.productCount = `${count}+`;
                sub.dataFile = dataFileRelative;
            }
        };
        if (cat.sections) {
            cat.sections.forEach(sec => findAndUpdate(sec.subcategories));
        } else {
            findAndUpdate(cat.subcategories);
        }
    });
}

function updateMasterConfig(subcategoryName, targetFolder, count) {
    if (!fs.existsSync(MASTER_PRODUCTS_PATH)) return;
    const productsDB = JSON.parse(fs.readFileSync(MASTER_PRODUCTS_PATH, 'utf8'));
    updateMasterConfigInMemory(productsDB, subcategoryName, targetFolder, count);
    fs.writeFileSync(MASTER_PRODUCTS_PATH, JSON.stringify(productsDB, null, 4));
    console.log(`Updated master config: ${MASTER_PRODUCTS_PATH}`);
}

// Support command line args
const args = process.argv.slice(2);
const filterIndex = args.indexOf('--filter');
const filterVal = filterIndex !== -1 ? args[filterIndex + 1] : null;

if (args[0] === '--all' || filterVal) {
    syncAll(filterVal);
} else if (args.length >= 3) {
    syncSubcategory(args[0], args[1], args[2]);
} else {
    console.log("Usage:");
    console.log("  node scripts/smart_sync.js --all                       (Sync all subcategories from nn.json)");
    console.log("  node scripts/smart_sync.js --filter <name>             (Sync specific filtered subcategories)");
    console.log("  node scripts/smart_sync.js <keyword> <path> <prefix>  (Sync specific subcategory)");
}
