const fs = require('fs');
const path = require('path');

const CONSTANTS_DIR = path.join(__dirname, '..', 'constants', 'products');

function getSmartBadge(title, price, rating) {
    const t = title.toLowerCase();
    if (t.includes('limited') || t.includes('special')) return 'Limited Edition';
    if (t.includes('new') || t.includes('arrival')) return 'New Arrival';
    if (t.includes('sale') || t.includes('discount')) return 'Mega Sale';
    if (t.includes('premium') || t.includes('luxury')) return 'Premium';
    
    // Randomize based on title length or hash to keep it deterministic but varied
    const hash = t.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const mod = hash % 10;
    
    if (mod === 0) return 'Bestseller';
    if (mod === 1) return 'Trending';
    if (mod === 2) return 'Top Rated';
    if (mod === 3) return 'Hot Deal';
    if (mod === 4) return 'Staff Pick';
    if (mod === 5) return 'Mega Sale';
    if (mod === 6) return 'New Arrival';
    if (mod === 7) return 'Limited Edition';
    return null; // 20% chance of no badge
}

function processDirectory(dirPath) {
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.lstatSync(fullPath);
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (item === 'products.json') {
            let products = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
            let modified = false;
            products.forEach(p => {
                p.badge = getSmartBadge(p.title, p.price, p.rating);
                modified = true;
            });
            if (modified) {
                fs.writeFileSync(fullPath, JSON.stringify(products, null, 4));
            }
        }
    }
}

processDirectory(CONSTANTS_DIR);
console.log('Badges updated based on product names and rules.');
