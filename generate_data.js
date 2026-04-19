const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'constants', 'products');
const jsonDest = path.join(__dirname, 'data', 'products.json');

// Mapped Categories based on existing folders
const categories = {
    'tshirts': { name: 'T-Shirts', subs: ['Oversized', 'Premium Cotton', 'Graphic Tees'] },
    'Hoodies': { name: 'Hoodies', subs: ['Winter Collection', 'Zipper', 'Pullover'] },
    '2DMobileCover': { name: 'Phone Cases', subs: ['Hard Case', 'Soft Case', 'Glass Case'] },
    'cups': { name: 'Mugs', subs: ['Magic Mug', 'Ceramic', 'Travel Mug'] },
    'woodenFrame': { name: 'Frames', subs: ['Wall Art', 'Desk Frame', 'Collage'] },
    'KeyChain': { name: 'Keychains', subs: ['Metal', 'Acrylic', 'Wood'] },
    'toteBags': { name: 'Tote Bags', subs: ['Canvas', 'Cotton', 'Printed'] },
    'facemask': { name: 'Masks', subs: ['Cotton', 'Layered'] },
    'childCostume': { name: 'Kids Clothing', subs: ['Tees', 'Onesies'] },
    'pendant': { name: 'Jewelry', subs: ['Necklaces', 'Bracelets'] },
    'slipperPrint': { name: 'Footwear', subs: ['Flip Flops', 'Slides'] },
    'stonePastings': { name: 'Decor', subs: ['Stones', 'Crystals'] }
};

// Start generation
let productsDatabase = { categories: [] };

// Clean existing data dir if needed
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

// Ensure the root constants/products exists
if (!fs.existsSync(targetDir)) {
    console.error("constants/products doesn't exist");
    process.exit(1);
}

// Remove old generic folders and replace with proper structured folders
// Actually, to be safe, I'll just create the NEW structured folders and leave old alone or rename if exact match.
Object.keys(categories).forEach(folderName => {
    let oldPath = path.join(targetDir, folderName);
    let catMeta = categories[folderName];
    let newCatPath = path.join(targetDir, catMeta.name);

    if (fs.existsSync(oldPath) && folderName !== catMeta.name) {
        fs.renameSync(oldPath, newCatPath);
    } else if (!fs.existsSync(newCatPath)) {
        fs.mkdirSync(newCatPath, { recursive: true });
    }

    let catObj = {
        id: 'cat-' + catMeta.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
        name: catMeta.name,
        subcategories: []
    };

    catMeta.subs.forEach(subName => {
        let subPath = path.join(newCatPath, subName);
        if (!fs.existsSync(subPath)) {
            fs.mkdirSync(subPath, { recursive: true });
        }

        let subObj = {
            id: 'sub-' + subName.toLowerCase().replace(/[^a-z0-9]/g, ''),
            name: subName,
            products: []
        };

        // Generates 15 products per category total (5 per subcategory)
        // Adjusting to hit 15 per category
        for (let i = 1; i <= 6; i++) {
            let pId = `prod-${catObj.id}-${subObj.id}-${i}`;
            let pPath = path.join(subPath, pId);
            
            if (!fs.existsSync(pPath)) {
                fs.mkdirSync(pPath, { recursive: true });
            }

            // Note: We don't artificially create 1.jpeg here, we just make the folders ready for the user to drop files into.
            // But we tell the JSON that these images "will" exist.
            
            let price = Math.floor(Math.random() * 800) + 299;
            let ogPrice = price + (Math.floor(Math.random() * 500) + 100);

            let productObj = {
                id: pId,
                title: `${subName} ${catMeta.name} ${i}`,
                description: `Premium quality ${subName} ${catMeta.name.toLowerCase()}. Customizable options available.`,
                price: price,
                originalPrice: ogPrice,
                rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                reviewCount: Math.floor(Math.random() * 500) + 10,
                baseImagePath: `constants/products/${catMeta.name}/${subName}/${pId}/`,
                images: ['1.jpeg', '2.jpeg', '3.jpeg', '4.jpeg']
            };

            subObj.products.push(productObj);
        }

        catObj.subcategories.push(subObj);
    });

    productsDatabase.categories.push(catObj);
});

// Save giant JSON
fs.writeFileSync(jsonDest, JSON.stringify(productsDatabase, null, 4));
console.log('Database built successfully and folder structure created.');
