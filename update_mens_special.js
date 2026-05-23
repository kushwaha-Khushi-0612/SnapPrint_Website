const fs = require('fs');
const path = require('path');

const PRODUCTS_DB_PATH = path.join(__dirname, 'data', 'products.json');
const db = JSON.parse(fs.readFileSync(PRODUCTS_DB_PATH, 'utf8'));

const userList = [
    {
        "name": "Men T-Shirts",
        "image": "https://static.yourprint.in/wp-content/uploads/2023/10/mens-t-shirt-247x296.jpg"
    },
    {
        "name": "Polo Shirts",
        "image": "https://static.yourprint.in/wp-content/uploads/2023/12/polo-t-shirt-247x296.jpg"
    },
    {
        "name": "Hoodies",
        "image": "https://static.yourprint.in/wp-content/uploads/2023/10/mens-hoodie-247x296.jpg"
    },
    {
        "name": "Sweatshirts",
        "image": "https://static.yourprint.in/wp-content/uploads/2023/12/Sweatshirt-247x296.jpg"
    },
    {
        "name": "Jackets",
        "image": "https://static.yourprint.in/wp-content/uploads/2023/10/varsity-jacket-247x296.jpg"
    },
    {
        "name": "Men's Shirts",
        "image": "https://static.yourprint.in/wp-content/uploads/2023/12/shirt-247x296.jpg"
    },
    {
        "name": "Full Sleeves Men's T-Shirts",
        "image": "https://static.yourprint.in/wp-content/uploads/2025/08/Tshirt-full-sleeve-247x296.png"
    },
    {
        "name": "Men Tank Top Vest",
        "image": "https://static.yourprint.in/wp-content/uploads/2024/02/tank-top-247x296.jpg"
    },
    {
        "name": "Plain T-Shirts for Men",
        "image": "https://static.yourprint.in/wp-content/uploads/2025/08/PLain-thsirt-247x296.png"
    },
    {
        "name": "Caps",
        "image": "https://static.yourprint.in/wp-content/uploads/2023/08/grid_cap-247x296.jpg"
    },
    {
        "name": "Track Pants",
        "image": "https://static.yourprint.in/wp-content/uploads/2024/03/JOGGAR-247x296.jpg"
    },
    {
        "name": "Shorts for Men",
        "image": "https://static.yourprint.in/wp-content/uploads/2024/03/men-shorts-cat-247x296.jpg"
    },
    {
        "name": "Mufflers",
        "image": "https://static.yourprint.in/wp-content/uploads/2023/09/muffler-247x296.jpg"
    },
    {
        "name": "Bathrobes",
        "image": "https://static.yourprint.in/wp-content/uploads/2023/09/bathrobs_1-247x296.jpg"
    },
    {
        "name": "Aprons",
        "image": "https://static.yourprint.in/wp-content/uploads/2023/09/apron-247x296.jpg"
    }
];

const tShirtsCat = db.categories.find(c => c.name === 'T-Shirts');
const menTshirts = tShirtsCat.sections.find(s => s.name === 'Men Clothing').subcategories;

const mensSpecialCat = db.categories.find(c => c.name === "Men's Special");

const newSubcats = [];

// Helper to normalize names for comparison
function normalize(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '').replace('tshirts', '').replace('formen', '').replace('mens', '');
}

const seenNames = new Set();

// 1. Add user list
userList.forEach(item => {
    const norm = normalize(item.name);
    seenNames.add(norm);
    newSubcats.push({
        id: "sub-ms-" + item.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
        name: item.name,
        image: item.image,
        description: `${item.name} Men's Special`,
        productCount: "8+",
        dataFile: `constants/products/Men's Special/${item.name}/products.json`
    });
});

// 2. Add T-Shirts Men Clothing if not already present
menTshirts.forEach(item => {
    const norm = normalize(item.name);
    if (!seenNames.has(norm)) {
        seenNames.add(norm);
        newSubcats.push({
            id: "sub-ms-" + item.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
            name: item.name,
            image: item.image, // keep original image
            description: `${item.name} Men's Special`,
            productCount: "8+",
            dataFile: `constants/products/Men's Special/${item.name}/products.json`
        });
    }
});

mensSpecialCat.subcategories = newSubcats;

fs.writeFileSync(PRODUCTS_DB_PATH, JSON.stringify(db, null, 4));
console.log("Successfully updated Men's Special category with " + newSubcats.length + " subcategories.");
