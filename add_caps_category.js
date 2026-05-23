const fs = require('fs');
const path = require('path');
const PRODUCTS_DB_PATH = path.join(__dirname, 'data', 'products.json');
const db = JSON.parse(fs.readFileSync(PRODUCTS_DB_PATH, 'utf8'));

// Add Caps as a top-level category
const capsCat = {
    id: 'cat-caps',
    name: 'Caps',
    subcategories: [
        {
            id: 'sub-caps-baseball',
            name: 'Baseball Caps',
            image: 'https://static.yourprint.in/wp-content/uploads/2023/08/grid_cap-247x296.jpg',
            description: 'Baseball Caps - Customized Printed Baseball Caps for Men & Women',
            productCount: '100+',
            dataFile: 'constants/products/Caps/Baseball Caps/products.json'
        },
        {
            id: 'sub-caps-snapback',
            name: 'Snapback Caps',
            image: 'https://static.yourprint.in/wp-content/uploads/2023/08/grid_cap-247x296.jpg',
            description: 'Snapback Caps - Hip Hop Flat Brim Adjustable Caps',
            productCount: '9+',
            dataFile: 'constants/products/Caps/Snapback Caps/products.json'
        },
        {
            id: 'sub-caps-lifestyle',
            name: 'Printed & Lifestyle Caps',
            image: 'https://static.yourprint.in/wp-content/uploads/2023/08/grid_cap-247x296.jpg',
            description: 'Printed & Lifestyle Caps - Beanies, Visors, Sun Hats and more',
            productCount: '174+',
            dataFile: 'constants/products/Caps/Printed & Lifestyle Caps/products.json'
        }
    ]
};

// Insert alphabetically after 'Bags' area — just push and then sort
const exists = db.categories.find(c => c.name === 'Caps');
if (!exists) {
    db.categories.push(capsCat);
    // Sort categories alphabetically by name
    db.categories.sort((a, b) => a.name.localeCompare(b.name));
    console.log('Added Caps as a top-level category with 3 subcategories.');
} else {
    exists.subcategories = capsCat.subcategories;
    console.log('Updated existing Caps category with 3 subcategories.');
}

fs.writeFileSync(PRODUCTS_DB_PATH, JSON.stringify(db, null, 4));
console.log('Done.');
