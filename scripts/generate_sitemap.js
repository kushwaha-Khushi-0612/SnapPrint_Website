const fs = require('fs');
const path = require('path');

const PRODUCTS_ALL_PATH = path.join(__dirname, '..', 'data', 'products_all.json');
const SITEMAP_PATH = path.join(__dirname, '..', 'sitemap.xml');
const BASE_URL = 'https://snapprint.in';

function generateSitemap() {
    console.log('Generating sitemap.xml...');
    
    let allProducts = [];
    if (fs.existsSync(PRODUCTS_ALL_PATH)) {
        allProducts = JSON.parse(fs.readFileSync(PRODUCTS_ALL_PATH, 'utf8'));
    } else {
        console.warn('products_all.json not found. Generating basic sitemap only.');
    }

    const staticPages = [
        { loc: '/', changefreq: 'daily', priority: '1.0' },
        { loc: '/searchPage.html', changefreq: 'daily', priority: '0.9' },
        { loc: '/customizer.html', changefreq: 'weekly', priority: '0.8' },
    ];

    const categories = [
        'Decor', 'Face Masks', 'Footwear', 'Hoodies', 'Jewelry', 
        'Key Chains', 'Kids Clothing', 'Mugs & Cups', 'Pendants', 
        'Phone Cases', 'Photo Frames', 'T-Shirts', 'Tote Bags', 
        "Men's Special", "Women's Special"
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static Pages
    staticPages.forEach(page => {
        xml += `  <url>\n`;
        xml += `    <loc>${BASE_URL}${page.loc}</loc>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += `  </url>\n`;
    });

    // Categories
    categories.forEach(cat => {
        xml += `  <url>\n`;
        xml += `    <loc>${BASE_URL}/productCategory.html?category=${encodeURIComponent(cat)}</loc>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.9</priority>\n`;
        xml += `  </url>\n`;
    });

    // Products (Limit to 40,000 to be safe within the 50,000 URL limit for a single sitemap)
    let productCount = 0;
    allProducts.slice(0, 40000).forEach(product => {
        if (!product.id) return;
        xml += `  <url>\n`;
        xml += `    <loc>${BASE_URL}/productDetails.html?id=${encodeURIComponent(product.id)}</loc>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += `  </url>\n`;
        productCount++;
    });

    xml += `</urlset>`;

    fs.writeFileSync(SITEMAP_PATH, xml, 'utf8');
    console.log(`Successfully generated sitemap.xml with ${staticPages.length + categories.length + productCount} URLs!`);
}

// Allow being required or run directly
if (require.main === module) {
    generateSitemap();
}

module.exports = { generateSitemap };
