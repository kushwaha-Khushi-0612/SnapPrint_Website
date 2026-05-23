const fs = require('fs');
let code = fs.readFileSync('scripts/dataService.js', 'utf8');

code = code.replace(/fetch\('data\/products\.json(\?v=\d+)?'\)/g, "fetch('data/products.json?v=25')");
code = code.replace(/fetch\('data\/products_all\.json(\?v=\d+)?'\)/g, "fetch('data/products_all.json?v=25')");
code = code.replace(/fetch\('data\/products_homepage\.json(\?v=\d+)?'\)/g, "fetch('data/products_homepage.json?v=25')");

fs.writeFileSync('scripts/dataService.js', code);
console.log('Added cache busters to fetches');
