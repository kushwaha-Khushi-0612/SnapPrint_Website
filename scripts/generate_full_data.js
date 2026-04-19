const fs = require('fs');
const path = require('path');

const categoriesBase = [
    {
        name: "T-Shirts",
        sections: ["Men Clothing", "Women Clothing"],
        subcategories: ["Round Neck", "V-Neck", "Polo", "Henley", "Oversized", "Slim Fit", "Regular Fit", "Graphic", "Printed", "Plain", "Typography", "Full Sleeve", "Half Sleeve", "Sleeveless", "Crop", "Longline", "Sports", "Compression", "Washed", "Acid Wash", "Pocket", "Raglan", "Hooded", "Drop Shoulder", "Custom"]
    },
    {
        name: "Hoodies",
        sections: ["Men Clothing", "Women Clothing"],
        subcategories: ["Pullover", "Zip-Up", "Oversized", "Slim Fit", "Graphic", "Printed", "Plain", "Crop", "Longline", "Sleeveless", "Fleece", "Sherpa", "Lightweight", "Heavyweight", "Sports", "Techwear", "Streetwear", "Color Block", "Embroidered", "Washed", "Distressed", "Custom"]
    },
    {
        name: "Footwear",
        sections: ["Men Clothing", "Women Clothing"],
        subcategories: ["Flip Flops", "Slides", "Rubber", "Foam", "Leather", "Indoor", "Outdoor", "Bathroom", "Anti-Skid", "Orthopedic", "Platform", "Designer", "Printed", "Plain", "Fur", "Kids", "Sports Sliders", "Waterproof", "Memory Foam", "Custom"]
    },
    {
        name: "Phone Cases",
        subcategories: ["Hard", "Silicone", "TPU", "Transparent", "Printed", "Matte", "Glossy", "Shockproof", "Rugged", "Flip", "Wallet", "Magnetic", "Magsafe", "Ring Holder", "Kickstand", "Waterproof", "Cooling", "Leather", "Custom", "3D"]
    },
    {
        name: "Mugs & Cups",
        subcategories: ["Ceramic", "Coffee", "Tea", "Travel", "Stainless Steel", "Glass", "Double Wall", "Insulated", "Printed", "Photo", "Magic (Heat Sensitive)", "Matte Finish", "Glossy", "Minimalist", "Designer", "Cartoon", "Couple", "Office", "Beer", "Espresso", "Handmade", "Eco-Friendly", "Custom"]
    },
    {
        name: "Key Chains",
        subcategories: ["Metal", "Wooden", "Acrylic", "Rubber", "LED", "Bottle Opener", "Multi-tool", "Name", "Photo", "Couple", "Cartoon", "Car Logo", "Leather", "Minimalist", "Rotating", "Glow", "Smart", "Handmade", "Beaded", "Resin"]
    },
    {
        name: "Photo Frames",
        subcategories: ["Wooden", "Metal", "Glass", "Acrylic", "Digital", "Wall Hanging", "Tabletop", "Collage", "Multi-Photo", "Minimalist", "Designer", "Vintage", "Rustic", "LED", "Shadow Box", "Floating", "Poster", "Certificate", "Kids", "Couple", "Customized"]
    },
    {
        name: "Face Masks",
        subcategories: ["Cotton", "Printed", "Plain", "Designer", "Reusable", "Disposable", "Adjustable", "Anti-Pollution", "Filter", "N95 Style", "Kids", "Couple", "Festival", "Cartoon", "Transparent", "Layered", "Silk", "Custom", "Logo", "Sports"]
    },
    {
        name: "Tote Bags",
        subcategories: ["Canvas", "Cotton", "Jute", "Leather", "Mini", "Oversized", "Zipper", "Open", "Printed", "Plain", "Eco-Friendly", "Foldable", "Laptop", "Grocery", "Beach", "Designer", "Embroidered", "Transparent", "Waterproof", "Custom"]
    },
    {
        name: "Pendants",
        subcategories: ["Gold", "Silver", "Artificial", "Diamond", "Gemstone", "Alphabet", "Religious", "Heart", "Minimalist", "Statement", "Layered", "Couple", "Birthstone", "Lockets", "Vintage", "Bohemian", "Charm", "Engraved", "Resin", "Handmade"]
    }
];

const badges = ["Trending", "New Arrival", "Bestseller", "Limited Edition", "Occasional", "Special", null, null];
const colors = ["Red", "Blue", "Black", "White", "Navy", "Gray", "Green"];
const tags = ["premium", "custom", "durable", "high-quality", "fashion", "unique", "gift"];

function generateProducts(catName, sectionName, subName) {
    const products = [];
    const count = 5; // Generate 5 products per leaf subcategory to keep the file size manageable initially
    for (let i = 1; i <= count; i++) {
        const id = `prod-${catName.toLowerCase().replace(/\s/g, '')}-${sectionName ? sectionName.toLowerCase().replace(/\s/g, '') + '-' : ''}${subName.toLowerCase().replace(/\s/g, '')}-${i}`;
        const price = Math.floor(Math.random() * 800) + 200;
        const originalPrice = price + Math.floor(Math.random() * 400) + 100;
        
        const basePath = `constants/products/${catName}/${sectionName ? sectionName + '/' : ''}${subName}/${id}/`;
        
        products.push({
            id: id,
            sku_id: `SKU-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            title: `${subName} ${catName} ${i}`,
            description: `Premium quality ${subName} ${catName.toLowerCase()}. Customizable print options available.`,
            price: price,
            originalPrice: originalPrice,
            rating: (Math.random() * 1.5 + 3.5).toFixed(1),
            reviewCount: Math.floor(Math.random() * 500) + 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            availableSizes: ["S", "M", "L", "XL"],
            badge: badges[Math.floor(Math.random() * badges.length)],
            productTag: tags[Math.floor(Math.random() * tags.length)],
            baseImagePath: basePath,
            images: ["1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg"],
            can_beCustomised: Math.random() > 0.3 ? 1 : 0
        });
    }
    return products;
}

const finalDB = { categories: [] };

categoriesBase.forEach(catDef => {
    const category = {
        id: `cat-${catDef.name.toLowerCase().replace(/\s/g, '')}`,
        name: catDef.name,
    };

    if (catDef.sections) {
        category.sections = catDef.sections.map(secName => ({
            name: secName,
            subcategories: catDef.subcategories.map(subName => {
                const prods = generateProducts(catDef.name, secName, subName);
                // Create directories
                prods.forEach(p => {
                    const fullPath = path.join(__dirname, '..', p.baseImagePath);
                    if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
                });
                return {
                    id: `sub-${secName.toLowerCase().replace(/\s/g, '')}-${subName.toLowerCase().replace(/\s/g, '')}`,
                    name: subName,
                    products: prods
                };
            })
        }));
    } else {
        category.subcategories = catDef.subcategories.map(subName => {
            const prods = generateProducts(catDef.name, null, subName);
            // Create directories
            prods.forEach(p => {
                const fullPath = path.join(__dirname, '..', p.baseImagePath);
                if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
            });
            return {
                id: `sub-${subName.toLowerCase().replace(/\s/g, '')}`,
                name: subName,
                products: prods
            };
        });
    }

    finalDB.categories.push(category);
});

fs.writeFileSync(path.join(__dirname, '../data/products.json'), JSON.stringify(finalDB, null, 4));
console.log('✅ Comprehensive products.json generated with Men/Women sections and all PDF categories!');
