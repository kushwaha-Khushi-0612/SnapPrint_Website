const fs = require('fs');
const path = require('path');
const https = require('https');

const productsDir = path.join(__dirname, '../constants/products');

// Fetch a placeholder image
const placeholderUrl = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop';
const placeholderBuffer = [];

https.get(placeholderUrl, (res) => {
    res.on('data', chunk => placeholderBuffer.push(chunk));
    res.on('end', () => {
        const imageBuffer = Buffer.concat(placeholderBuffer);
        
        function populateDir(dir) {
            const items = fs.readdirSync(dir);
            let hasFiles = false;
            let hasDirs = false;
            
            for (const item of items) {
                const fullPath = path.join(dir, item);
                if (fs.statSync(fullPath).isDirectory()) {
                    hasDirs = true;
                    populateDir(fullPath);
                } else if (item.endsWith('.jpeg')) {
                    hasFiles = true;
                }
            }
            
            // If it's a leaf directory (e.g., product directory) and has no jpegs, populate it
            if (!hasDirs && !hasFiles && path.basename(dir).startsWith('prod-')) {
                console.log(`Populating ${path.basename(dir)}`);
                for (let i = 1; i <= 4; i++) {
                    fs.writeFileSync(path.join(dir, `${i}.jpeg`), imageBuffer);
                }
            }
        }
        
        console.log('Starting asset population...');
        populateDir(productsDir);
        console.log('Asset population complete!');
    });
}).on('error', (e) => {
    console.error('Error fetching placeholder:', e);
});
