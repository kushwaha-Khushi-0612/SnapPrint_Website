
const fs = require('fs');

const db = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));
const currentCategory = 't-shirts'; // Testing with dash

let catRegex = new RegExp(currentCategory, 'i');
let categoryData = db.categories.find(c => catRegex.test(c.name));

if (!categoryData) {
    console.log('Category not found for:', currentCategory);
    categoryData = db.categories[0];
}

console.log('Category Data Name:', categoryData.name);

const isSpecialCategory = ['T-Shirts', 'Hoodies'].includes(categoryData.name);
console.log('Is Special Category:', isSpecialCategory);

if (isSpecialCategory && categoryData.sections) {
    categoryData.sections.forEach((section, index) => {
        console.log(`Section ${index}: ${section.name}, Subcategories: ${section.subcategories.length}`);
    });
}
