/**
 * Search Page Script - Intelligent Dynamic Dropdowns
 */

const ITEMS_PER_PAGE = 6;

let allProducts = [];
let allCategoriesRaw = [];
let filteredProducts = [];
let filterConfig = {};

// App State
const state = {
    selectedCategory: '', // Now a single string mapped from the dropdown
    selectedSubcategories: [],
    dynamicFilters: {}, // Maps filter ID to array of selected values (or min/max object for slider)
    sort: 'recommended',
    page: 1,
    searchQuery: ''
};

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Loading Intelligent Search Page...');
    
    // Parse URL Params and setup initial state
    parseURLParams();
    
    // Initialize Data Service & Config
    await loadData();
    
    // Render Filters
    renderCategoryDropdown();
    
    // Setup listeners (including Accordions and Mobile Drawer)
    setupEventListeners();
    
    // Apply filters and render UI
    applyFilters();
    
    console.log('✅ Search Page Ready!');
});

function parseURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    const cat = urlParams.get('category');
    if (cat) state.selectedCategory = cat.trim().toLowerCase();
    
    const subcat = urlParams.get('subcategory');
    if (subcat) state.selectedSubcategories = subcat.split(',').map(c => c.trim().toLowerCase());
    
    const sort = urlParams.get('sort');
    if (sort) state.sort = sort;
    
    const page = urlParams.get('page');
    if (page && !isNaN(page)) state.page = parseInt(page);
    
    const q = urlParams.get('q');
    if (q) {
        state.searchQuery = q.toLowerCase();
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) searchInput.value = q;
    }

    // Dynamic filters will dynamically read URL params in their render pass if needed, 
    // but for simple parsing, we can just scoop any remaining non-standard keys.
    for (const [key, value] of urlParams.entries()) {
        if (!['category', 'subcategory', 'sort', 'page', 'q'].includes(key)) {
            // It's a dynamic filter (e.g., color=black,white or price=min,max)
            state.dynamicFilters[key] = value;
        }
    }
}

async function loadData() {
    await window.dataService.init();
    allCategoriesRaw = window.dataService.productsDB.categories;
    allProducts = await window.dataService.getAllProductsFlattened();
    
    try {
        const response = await fetch('data/filters.json');
        filterConfig = await response.json();
    } catch (e) {
        console.error("Failed to load filters.json", e);
        filterConfig = { global: [] };
    }
}

function renderCategoryDropdown() {
    const select = document.getElementById('category-select');
    let html = '<option value="">All Categories</option>';
    
    allCategoriesRaw.forEach(cat => {
        const val = cat.name.toLowerCase();
        const isSelected = (state.selectedCategory === val) ? 'selected' : '';
        html += `<option value="${cat.name}" ${isSelected}>${cat.name}</option>`;
    });
    
    select.innerHTML = html;
    
    updateSubcategoryFilters();
    renderDynamicFilters();
}

function updateSubcategoryFilters() {
    const subContainer = document.getElementById('subcategory-filters');
    const groupWrapper = document.getElementById('subcategory-filter-group');
    
    let relevantCats = allCategoriesRaw;
    if (state.selectedCategory) {
        relevantCats = allCategoriesRaw.filter(c => c.name.toLowerCase() === state.selectedCategory);
    }
    
    let subDict = {};
    relevantCats.forEach(cat => {
        if (cat.sections) {
            cat.sections.forEach(sec => {
                sec.subcategories.forEach(sub => subDict[sub.name] = sub.id || sub.name);
            });
        } else if (cat.subcategories) {
            cat.subcategories.forEach(sub => subDict[sub.name] = sub.id || sub.name);
        }
    });
    
    const subNames = Object.keys(subDict).sort();
    
    if (subNames.length === 0) {
        groupWrapper.classList.add('hide');
        return;
    }
    
    groupWrapper.classList.remove('hide');
    let subHtml = '';
    subNames.forEach(name => {
        const valId = subDict[name].toLowerCase();
        const isChecked = state.selectedSubcategories.includes(valId) || state.selectedSubcategories.includes(name.toLowerCase()) ? 'checked' : '';
        subHtml += `
            <label class="filter-label">
                <input type="checkbox" value="${valId}" data-real-name="${name}" data-filter-type="subcategory" ${isChecked}>
                <span>${name}</span>
            </label>
        `;
    });
    subContainer.innerHTML = subHtml;

    // Auto expand subcategories accordion if active
    const btn = groupWrapper.querySelector('.accordion-header');
    if (btn && btn.getAttribute('aria-expanded') === 'false' && state.selectedSubcategories.length > 0) {
        toggleAccordion(btn);
    }
}

function renderDynamicFilters() {
    const container = document.getElementById('dynamic-filters-container');
    container.innerHTML = '';
    
    // Find proper config for category, merge with global
    let activeConfigs = [...(filterConfig.global || [])];
    
    if (state.selectedCategory) {
        // We match exactly the category name case-insensitively
        const realObjKey = Object.keys(filterConfig).find(k => k.toLowerCase() === state.selectedCategory);
        if (realObjKey && filterConfig[realObjKey]) {
            activeConfigs = [...activeConfigs, ...filterConfig[realObjKey]];
        }
    }

    activeConfigs.forEach(conf => {
        const wrapper = document.createElement('div');
        wrapper.className = 'filter-group accordion';
        
        let contentHtml = '';
        
        // Recover state
        const savedVal = state.dynamicFilters[conf.id] || '';

        if (conf.type === 'slider') {
            let curMin = conf.min;
            let curMax = conf.max;
            if (savedVal.includes('-')) {
                const parts = savedVal.split('-');
                if(parts[0]) curMin = parseInt(parts[0]);
                if(parts[1]) curMax = parseInt(parts[1]);
            }
            contentHtml = `
                <div class="range-slider-wrapper">
                    <div class="range-slider-nav">
                        <span id="${conf.id}-val-min">₹${curMin}</span>
                        <span id="${conf.id}-val-max">₹${curMax}</span>
                    </div>
                    <input type="range" id="${conf.id}-range" min="${conf.min}" max="${conf.max}" step="${conf.step || 1}" value="${curMax}" class="slider-input" data-filter-type="dynamic-slider" data-filter-id="${conf.id}">
                </div>
            `;
        } else if (conf.type === 'color') {
            let activeColors = savedVal ? savedVal.split(',') : [];
            let swatches = '';
            conf.options.forEach(opt => {
                const checked = activeColors.includes(opt.toLowerCase()) ? 'checked' : '';
                // mapped color codes
                const bg = getHexForColorName(opt);
                swatches += `
                    <label class="color-swatch-label" title="${opt}">
                        <input type="checkbox" value="${opt.toLowerCase()}" data-filter-type="dynamic-checkbox" data-filter-id="${conf.id}" ${checked}>
                        <span class="color-swatch" style="background-color: ${bg}"></span>
                    </label>
                `;
            });
            contentHtml = `<div class="color-grid">${swatches}</div>`;
        } else if (conf.type === 'checkbox') {
            let activeVals = savedVal ? savedVal.split(',') : [];
            let boxes = '';
            conf.options.forEach(opt => {
                const checked = activeVals.includes(opt.toLowerCase()) ? 'checked' : '';
                boxes += `
                    <label class="filter-label">
                        <input type="checkbox" value="${opt.toLowerCase()}" data-filter-type="dynamic-checkbox" data-filter-id="${conf.id}" ${checked}>
                        <span>${opt}</span>
                    </label>
                `;
            });
            contentHtml = `<div class="filter-options">${boxes}</div>`;
        }

        wrapper.innerHTML = `
            <button class="accordion-header" aria-expanded="true">
                <span>${conf.label}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <div class="accordion-content">
                <div class="accordion-inner">
                    ${contentHtml}
                </div>
            </div>
        `;
        container.appendChild(wrapper);
    });

    // Reattach Accordion Listeners for dynamically added content
    container.querySelectorAll('.accordion-header').forEach(btn => {
        btn.addEventListener('click', () => toggleAccordion(btn));
        const content = btn.nextElementSibling;
        if (btn.getAttribute('aria-expanded') === 'true') {
            content.style.maxHeight = content.scrollHeight + 50 + "px";
        }
    });

    // Attach Range Listeners strictly to update UI dynamically
    container.querySelectorAll('.slider-input').forEach(slider => {
        slider.addEventListener('input', (e) => {
            document.getElementById(`${e.target.dataset.filterId}-val-max`).textContent = `₹${e.target.value}`;
        });
        slider.addEventListener('change', (e) => {
            handleDynamicChange(e.target.dataset.filterId, `0-${e.target.value}`);
        });
    });
}

function getHexForColorName(name) {
    const map = {
        'white': '#ffffff', 'black': '#000000', 'navy': '#000080', 
        'gray': '#808080', 'red': '#ff0000', 'green': '#008000', 'blue': '#0000ff',
        'clear': 'transparent', 'yellow': '#ffff00'
    };
    return map[name.toLowerCase()] || '#ccc';
}

function toggleAccordion(btn) {
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    const content = btn.nextElementSibling;
    
    if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '0px';
    } else {
        btn.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 50 + "px";
    }
}

function setupEventListeners() {
    // Accordion Logic (Static ones)
    document.querySelectorAll('.accordion-header').forEach(btn => {
        btn.addEventListener('click', () => toggleAccordion(btn));
        const content = btn.nextElementSibling;
        if (btn.getAttribute('aria-expanded') === 'true' && content) {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });

    // Handle Mobile Sidebar Drawer
    const mobileToggle = document.getElementById('mobile-filter-toggle');
    const closeMobileBtn = document.getElementById('close-sidebar-mobile');
    const sidebar = document.getElementById('search-sidebar');

    if (mobileToggle) mobileToggle.addEventListener('click', () => sidebar.classList.add('mobile-open'));
    if (closeMobileBtn) closeMobileBtn.addEventListener('click', () => sidebar.classList.remove('mobile-open'));

    // Category Select Box
    document.getElementById('category-select').addEventListener('change', (e) => {
        state.selectedCategory = e.target.value.toLowerCase();
        // Reset subcategories config on category boundary shift
        state.selectedSubcategories = [];
        state.dynamicFilters = {}; 
        updateSubcategoryFilters();
        renderDynamicFilters();
        state.page = 1;
        applyFilters();
    });

    // Checkbox Listeners (Delegated)
    document.querySelector('.search-sidebar').addEventListener('change', (e) => {
        const type = e.target.getAttribute('data-filter-type');
        if (type === 'subcategory') {
            const value = e.target.value.toLowerCase();
            const realName = (e.target.getAttribute('data-real-name') || value).toLowerCase();
            if (e.target.checked) {
                if (!state.selectedSubcategories.includes(value)) state.selectedSubcategories.push(value);
                if (!state.selectedSubcategories.includes(realName)) state.selectedSubcategories.push(realName);
            } else {
                state.selectedSubcategories = state.selectedSubcategories.filter(c => c !== value && c !== realName);
            }
            state.page = 1;
            applyFilters();
        } else if (type === 'dynamic-checkbox') {
            const fid = e.target.dataset.filterId;
            const val = e.target.value.toLowerCase();
            let currentStr = state.dynamicFilters[fid] || '';
            let currentArr = currentStr ? currentStr.split(',') : [];
            
            if (e.target.checked) {
                currentArr.push(val);
            } else {
                currentArr = currentArr.filter(v => v !== val);
            }
            handleDynamicChange(fid, currentArr.join(','));
        }
    });

    // Clear All
    document.getElementById('clear-filters-btn').addEventListener('click', () => {
        document.getElementById('category-select').value = "";
        state.selectedCategory = '';
        state.selectedSubcategories = [];
        state.dynamicFilters = {};
        state.searchQuery = '';
        state.page = 1;
        
        document.querySelectorAll('.search-sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) searchInput.value = '';
        
        updateSubcategoryFilters();
        renderDynamicFilters();
        applyFilters();
    });

    // Sort Dropdown
    const sortSelect = document.getElementById('sort-dropdown');
    sortSelect.value = state.sort;
    sortSelect.addEventListener('change', (e) => {
        state.sort = e.target.value;
        state.page = 1; 
        applyFilters();
    });
}

function handleDynamicChange(filterId, newValueString) {
    if (!newValueString) {
        delete state.dynamicFilters[filterId];
    } else {
        state.dynamicFilters[filterId] = newValueString;
    }
    state.page = 1;
    applyFilters();
}

function applyFilters() {
    // 1. Filter Engine
    filteredProducts = allProducts.filter(p => {
        let match = true;

        if (state.searchQuery) {
            const matchesText = p.title.toLowerCase().includes(state.searchQuery) ||
                                (p.description && p.description.toLowerCase().includes(state.searchQuery));
            if (!matchesText) match = false;
        }

        if (state.selectedCategory && match) {
            if ((p.categoryName || '').toLowerCase() !== state.selectedCategory) match = false;
        }
        
        if (state.selectedSubcategories.length > 0 && match) {
            const subName = (p.subcategoryName || '').toLowerCase();
            const subId = (p.subcategoryId || '').toLowerCase();
            const matchSub = state.selectedSubcategories.some(reqSub => subName.includes(reqSub) || subId.includes(reqSub));
            if (!matchSub) match = false;
        }

        // Apply Dynamic JSON mapping configurations
        Object.keys(state.dynamicFilters).forEach(fid => {
            const valStr = state.dynamicFilters[fid];
            if (!valStr || !match) return;

            if (fid === 'price') {
                const max = parseInt(valStr.split('-')[1]);
                if (p.price > max) match = false;
            } else if (fid === 'gsm') {
                const selectedGSMs = valStr.split(',').map(v => v.trim());
                if (p.gsm) {
                    if (!selectedGSMs.includes(p.gsm.toString())) match = false;
                } else {
                    // If no GSM on product but GSM filter is active, check description just in case
                    const dataScope = ((p.description || '') + ' ' + (p.title || '')).toLowerCase();
                    const hasMatch = selectedGSMs.some(gsm => dataScope.includes(gsm));
                    if (!hasMatch) match = false;
                }
            } else if (fid === 'color') {
                const selectedColors = valStr.split(',').map(v => v.toLowerCase().trim());
                const prodColor = (p.color || '').toLowerCase();
                if (prodColor) {
                    if (!selectedColors.includes(prodColor)) match = false;
                } else {
                    // Fallback to title/description search
                    const dataScope = ((p.description || '') + ' ' + (p.title || '')).toLowerCase();
                    const hasMatch = selectedColors.some(color => dataScope.includes(color));
                    if (!hasMatch) match = false;
                }
            } else {
                // Generic rule for any other dynamic filters
                const options = valStr.split(',');
                const dataScope = ((p.description || '') + ' ' + (p.title || '')).toLowerCase();
                const optionMatch = options.some(opt => dataScope.includes(opt));
                if (!optionMatch) match = false;
            }
        });
        
        return match;
    });

    // 2. Sort Logic
    switch(state.sort) {
        case 'price-asc':
            filteredProducts.sort((a,b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a,b) => b.price - a.price);
            break;
        case 'newest':
            filteredProducts.sort((a,b) => b.id.localeCompare(a.id));
            break;
        case 'rating':
            filteredProducts.sort((a,b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
            break;
        default: 
            break;
    }

    updateURL();
    renderMainArea();
}

function updateURL() {
    const url = new URL(window.location);
    url.search = '';
    
    if (state.selectedCategory) url.searchParams.set('category', state.selectedCategory);
    
    let cleanSubs = Array.from(new Set(state.selectedSubcategories));
    if (cleanSubs.length > 0) url.searchParams.set('subcategory', cleanSubs.join(','));
    
    Object.keys(state.dynamicFilters).forEach(fid => {
        if(state.dynamicFilters[fid]) {
            url.searchParams.set(fid, state.dynamicFilters[fid]);
        }
    });

    if (state.sort && state.sort !== 'recommended') url.searchParams.set('sort', state.sort);
    if (state.page > 1) url.searchParams.set('page', state.page);
    if (state.searchQuery) url.searchParams.set('q', state.searchQuery);
    
    window.history.pushState({}, '', url);

    // Update Breadcrumb
    let breadcrumbText = 'Search Results';
    if (state.selectedCategory) {
        breadcrumbText = allCategoriesRaw.find(c => c.name.toLowerCase() === state.selectedCategory)?.name || breadcrumbText;
    }
    document.getElementById('breadcrumb-term').textContent = breadcrumbText;
    document.getElementById('search-title').textContent = breadcrumbText;
}

function renderMainArea() {
    const total = filteredProducts.length;
    document.getElementById('total-results').textContent = total;
    
    const startIdx = (state.page - 1) * ITEMS_PER_PAGE;
    const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, total);
    
    document.getElementById('showing-start').textContent = total > 0 ? (startIdx + 1) : 0;
    document.getElementById('showing-end').textContent = endIdx;

    const pageSlice = filteredProducts.slice(startIdx, endIdx);
    
    const grid = document.getElementById('search-results-grid');
    if (pageSlice.length > 0) {
        renderProducts(pageSlice, 'search-results-grid', { variant: 'default' });
    } else {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try clearing your active filters or expanding your search constraints.</p>
                <button class="clear-btn" onclick="document.getElementById('clear-filters-btn').click()" style="margin-top: 16px;">Clear All Filters</button>
            </div>
        `;
    }
    
    renderPagination(total);
}

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const container = document.getElementById('pagination-container');
    container.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    // Prev Button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerHTML = '&laquo;';
    prevBtn.disabled = state.page === 1;
    prevBtn.onclick = () => { state.page--; applyFilters(); window.scrollTo({top: 0, behavior: 'smooth'}); };
    container.appendChild(prevBtn);
    
    // Page Numbers
    for(let i=1; i<=totalPages; i++) {
        if (totalPages > 6 && i !== 1 && i !== totalPages && Math.abs(i - state.page) > 1) {
            if (i === 2 || i === totalPages - 1) {
                const s = document.createElement('span');
                s.className = 'page-ellipsis';
                s.textContent = '...';
                container.appendChild(s);
            }
            continue;
        }

        const btn = document.createElement('button');
        btn.className = `page-btn ${i === state.page ? 'active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => { state.page = i; applyFilters(); window.scrollTo({top: 0, behavior: 'smooth'}); };
        container.appendChild(btn);
    }
    
    // Next Button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = '&raquo;';
    nextBtn.disabled = state.page === totalPages;
    nextBtn.onclick = () => { state.page++; applyFilters(); window.scrollTo({top: 0, behavior: 'smooth'}); };
    container.appendChild(nextBtn);
}

// Global search execution override for header search bar
window.executeGlobalSearch = function(queryStr) {
    let q = queryStr;
    if (!q) q = document.getElementById('global-search-input')?.value;
    if (q) {
        state.searchQuery = q.toLowerCase();
        state.page = 1;
        applyFilters();
    }
};
