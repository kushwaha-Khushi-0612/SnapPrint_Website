/**
 * Category Unit Widget
 * Creates Premium Bento Grid Category Cards (Desktop) & Circular Icons (Mobile)
 */

const categoryIcons = {
    'Decor': 'constants/images/decor.png',
    'Face Masks': 'constants/images/faceMaks.png',
    'Footwear': 'constants/images/footwear.png',
    'Hoodies': 'constants/images/Hoodies.png',
    'Jewelry': 'constants/images/Jwellery.png',
    'Key Chains': 'https://images.unsplash.com/photo-1590650213165-c1fef80648c4?w=500&h=500&fit=crop',
    'Kids Clothing': 'constants/images/Kids Special.png',
    'Mugs & Cups': 'constants/images/Mugs and Cups.png',
    'Pendants': 'constants/images/pendants.png',
    'Phone Cases': 'constants/images/phoneCases.png',
    'Photo Frames': 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500&h=500&fit=crop',
    'T-Shirts': 'constants/images/Tshirts.png',
    'Tote Bags': 'constants/images/TOTABAGS.png',
    "Men's Special": 'constants/images/MensSpecial.png',
    "Women's Special": 'constants/images/womesSpecial.png'
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

// Colorful theme colors for mobile rings
const ringColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#82E0AA'];

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
    
    // Default background color applied if image doesn't load fully
    const bgStyle = isImagePath ? `style="background-image: url('${icon}'); background-color: #f4f4f4;"` : 'style="background-color: #f4f4f4;"';
    
    // Assign a theme color based on the category name
    const themeColor = ringColors[name.length % ringColors.length];

    return `
        <a href="${link}" class="category-unit ${sizeClass}" data-category="${name}" style="--theme-color: ${themeColor}">
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

    // Prioritize specific categories to appear first
    const topCategories = ["Men's Special", "Women's Special", "T-Shirts"];
    
    categories.sort((a, b) => {
        const aIndex = topCategories.indexOf(a.name);
        const bIndex = topCategories.indexOf(b.name);
        
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return 0; // Maintain relative order for others
    });

    const html = categories.map(category => createCategoryUnit(category)).join('');
    container.innerHTML = html;

    // Add scroll reveal classes
    container.classList.add('reveal', 'reveal-up');

    // Initialize Mobile Slider controls
    setTimeout(() => {
        if (window.innerWidth <= 768) {
            initMobileCategorySlider(container);
        }
    }, 100);
}

function initMobileCategorySlider(container) {
    if (!container.parentElement.classList.contains('cat-slider-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'cat-slider-wrapper';
        container.parentNode.insertBefore(wrapper, container);
        wrapper.appendChild(container);

        // Navigation Arrows
        const leftBtn = document.createElement('button');
        leftBtn.className = 'cat-nav-btn cat-nav-left';
        leftBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
        
        const rightBtn = document.createElement('button');
        rightBtn.className = 'cat-nav-btn cat-nav-right';
        rightBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
        
        wrapper.appendChild(leftBtn);
        wrapper.appendChild(rightBtn);

        const scrollAmount = 180;
        leftBtn.onclick = () => container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        rightBtn.onclick = () => container.scrollBy({ left: scrollAmount, behavior: 'smooth' });

        // Auto Scroll
        let autoScrollInterval;
        let isHovered = false;

        const startAutoScroll = () => {
            stopAutoScroll();
            autoScrollInterval = setInterval(() => {
                if (!isHovered) {
                    if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
                        container.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                    }
                }
            }, 3000);
        };

        const stopAutoScroll = () => {
            if (autoScrollInterval) clearInterval(autoScrollInterval);
        };

        container.addEventListener('touchstart', () => { isHovered = true; stopAutoScroll(); }, { passive: true });
        container.addEventListener('touchend', () => { 
            isHovered = false; 
            setTimeout(() => { if(!isHovered) startAutoScroll(); }, 2000); 
        }, { passive: true });

        wrapper.addEventListener('mouseenter', () => { isHovered = true; stopAutoScroll(); });
        wrapper.addEventListener('mouseleave', () => { isHovered = false; startAutoScroll(); });

        startAutoScroll();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createCategoryUnit, renderCategories, getCategoryIcon, categoryIcons };
}