/**
 * Category Unit Widget
 * Creates Premium Bento Grid Category Cards
 */

const categoryIcons = {
    'Decor': 'https://images.unsplash.com/photo-1616489953149-8f5b8f13f12a?w=800&h=800&fit=crop',
    'Face Masks': 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=500&h=500&fit=crop',
    'Footwear': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    'Hoodies': 'constants/category-images/cat_hoodies.png',
    'Jewelry': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop',
    'Key Chains': 'https://images.unsplash.com/photo-1590650213165-c1fef80648c4?w=500&h=500&fit=crop',
    'Kids Clothing': 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=800&h=600&fit=crop',
    'Mugs & Cups': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&h=500&fit=crop',
    'Pendants': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop',
    'Phone Cases': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=800&fit=crop',
    'Photo Frames': 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500&h=500&fit=crop',
    'T-Shirts': 'constants/category-images/cat_tshirts.png',
    'Tote Bags': 'https://images.unsplash.com/photo-1544816153-12ad5d7140a1?w=500&h=500&fit=crop',
    "Men's Special": 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800&h=800&fit=crop',
    "Women's Special": 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=800&fit=crop'
};

const sizeMapping = {
    "Men's Special": "category-large",
    "Women's Special": "category-wide",
    "T-Shirts": "category-wide",
    "Hoodies": "category-wide",
    "Kids Clothing": "category-wide",
    "Decor": "category-tall",
    "Phone Cases": "category-tall"
};

function getCategoryIcon(categoryName) {
    return categoryIcons[categoryName] || '📦';
}

function createCategoryUnit(config) {
    const {
        name,
        icon = '📦',
        count = 0,
        link = '#',
        showCount = true
    } = config;

    const sizeClass = sizeMapping[name] || "category-small";
    const isImagePath = icon.includes('/');
    const bgStyle = isImagePath ? `style="background-image: url('${icon}')"` : '';

    return `
        <a href="${link}" class="category-unit ${sizeClass}" data-category="${name}">
            <div class="category-bg" ${bgStyle}></div>
            <div class="category-overlay"></div>
            <div class="category-content">
                <div class="category-name">${name}</div>
                ${showCount ? `<div class="category-count">Explore 
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="M12 5l7 7-7 7"></path>
                    </svg>
                </div>` : ''}
            </div>
        </a>
    `;
}

function renderCategories(categories, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const html = categories.map(category => createCategoryUnit(category)).join('');
    container.innerHTML = html;

    // Add scroll reveal classes
    container.classList.add('reveal', 'reveal-up');
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createCategoryUnit, renderCategories, getCategoryIcon, categoryIcons };
}