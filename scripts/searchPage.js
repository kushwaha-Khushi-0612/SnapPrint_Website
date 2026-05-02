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
    selectedCollections: [], // For homepage custom sections
    dynamicFilters: {}, // Maps filter ID to array of selected values (or min/max object for slider)
    sort: 'recommended',
    page: 1,
    searchQuery: '',
    disableFuzzyMatch: false
};

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Loading Intelligent Search Page...');

    // Parse URL Params and setup initial state
    parseURLParams();

    // Initialize Data Service & Config
    await loadData();

    // Infer category from subcategory if missing (Supports direct subcategory links)
    if (!state.selectedCategory && state.selectedSubcategories.length > 0) {
        inferCategoryFromSub();
    }

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

    const col = urlParams.get('collection');
    if (col) state.selectedCollections = col.split(',').map(c => c.trim().toLowerCase());

    // Dynamic filters will dynamically read URL params in their render pass if needed, 
    // but for simple parsing, we can just scoop any remaining non-standard keys.
    for (const [key, value] of urlParams.entries()) {
        if (!['category', 'subcategory', 'sort', 'page', 'q', 'collection'].includes(key)) {
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
    renderMobileCategories();
    syncCollectionUI();
}

function syncCollectionUI() {
    document.querySelectorAll('.search-sidebar input[data-filter-type="collection"]').forEach(cb => {
        if (state.selectedCollections.includes(cb.value.toLowerCase())) {
            cb.checked = true;
        } else {
            cb.checked = false;
        }
    });
}

function renderMobileCategories() {
    const list = document.getElementById('mobile-category-list');
    if (!list) return;

    let html = `<div class="cat-pill ${!state.selectedCategory ? 'active' : ''}" data-cat="">All</div>`;

    allCategoriesRaw.forEach(cat => {
        const val = cat.name.toLowerCase();
        const isActive = (state.selectedCategory === val) ? 'active' : '';
        html += `<div class="cat-pill ${isActive}" data-cat="${cat.name}">${cat.name}</div>`;
    });

    list.innerHTML = html;

    list.querySelectorAll('.cat-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const cat = pill.getAttribute('data-cat');
            state.selectedCategory = cat.toLowerCase();
            state.selectedSubcategories = [];
            state.dynamicFilters = {};

            // Sync with sidebar select
            const sidebarSelect = document.getElementById('category-select');
            if (sidebarSelect) sidebarSelect.value = cat;

            updateSubcategoryFilters();
            renderDynamicFilters();
            renderMobileCategories();
            state.page = 1;
            applyFilters();

            pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
    });

    // Auto-scroll the active pill into view on initial render or update
    setTimeout(() => {
        const activePill = list.querySelector('.cat-pill.active');
        if (activePill) {
            activePill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, 100);
}

function inferCategoryFromSub() {
    const subToFind = state.selectedSubcategories[0];
    if (!subToFind) return;

    for (const cat of allCategoriesRaw) {
        const potentialSubs = [];
        if (cat.sections) {
            cat.sections.forEach(s => s.subcategories.forEach(sub => potentialSubs.push(sub)));
        } else if (cat.subcategories) {
            cat.subcategories.forEach(sub => potentialSubs.push(sub));
        }

        const found = potentialSubs.find(s =>
            (s.id && s.id.toLowerCase() === subToFind) ||
            (s.name && s.name.toLowerCase() === subToFind)
        );

        if (found) {
            state.selectedCategory = cat.name.toLowerCase();
            console.log(`🧠 Inferred Category: ${cat.name} from Subcategory: ${subToFind}`);
            break;
        }
    }
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
                if (parts[0]) curMin = parseInt(parts[0]);
                if (parts[1]) curMax = parseInt(parts[1]);
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
        'white': '#ffffff', 'black': '#000000', 'navy': '#000080', 'navy blue': '#000080',
        'gray': '#808080', 'grey': '#808080', 'red': '#ff0000', 'green': '#008000', 'blue': '#0000ff',
        'clear': 'transparent', 'yellow': '#ffff00', 'maroon': '#800000', 'purple': '#800080',
        'olive green': '#556b2f', 'kiwi green': '#8ee53f', 'asphalt': '#4e5452', 'lilac': '#c8a2c8',
        'mint green': '#98ff98', 'ocean blue': '#0077be', 'soft pink': '#ffb6c1',
        'sunset orange': '#fd5e53', 'teal green': '#006d5b'
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
    const backdrop = document.getElementById('sidebar-backdrop');

    const openFilters = () => {
        sidebar.classList.add('mobile-open');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    };

    const closeFilters = () => {
        sidebar.classList.remove('mobile-open');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (mobileToggle) mobileToggle.addEventListener('click', openFilters);
    if (closeMobileBtn) closeMobileBtn.addEventListener('click', closeFilters);
    if (backdrop) backdrop.addEventListener('click', closeFilters);

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
        } else if (type === 'collection') {
            const value = e.target.value.toLowerCase();
            if (e.target.checked) {
                if (!state.selectedCollections.includes(value)) state.selectedCollections.push(value);
            } else {
                state.selectedCollections = state.selectedCollections.filter(c => c !== value);
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
        state.selectedCollections = [];
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
    let filtered = allProducts.filter(p => {
        let match = true;

        if (state.searchQuery) {
            const keywords = state.searchQuery.split(/[\s,]+/).filter(k => k.length > 0);
            const dataScope = ((p.title || '') + ' ' + (p.description || '') + ' ' + (p.categoryName || '') + ' ' + (p.subcategoryName || '')).toLowerCase();
            const matchesText = keywords.every(kw => dataScope.includes(kw));
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

        if (state.selectedCollections.length > 0 && match) {
            const hasMatch = state.selectedCollections.some(reqCol => p.collections && p.collections.includes(reqCol.toLowerCase()));
            if (!hasMatch) match = false;
        }

        // Apply Dynamic JSON mapping configurations
        Object.keys(state.dynamicFilters).forEach(fid => {
            const valStr = state.dynamicFilters[fid];
            if (!valStr || !match) return;

            const selectedValues = valStr.split(',').map(v => v.toLowerCase().trim());

            if (fid === 'price') {
                const max = parseInt(valStr.split('-')[1]);
                if (p.price > max) match = false;
            } else if (fid === 'color') {
                const prodColor = (p.color || '').toLowerCase();
                if (prodColor) {
                    if (!selectedValues.includes(prodColor)) match = false;
                } else {
                    const dataScope = ((p.description || '') + ' ' + (p.title || '')).toLowerCase();
                    const hasMatch = selectedValues.some(color => dataScope.includes(color));
                    if (!hasMatch) match = false;
                }
            } else if (fid === 'material' || fid === 'fabric') {
                const prodFabric = (p.features && p.features.fabric || '').toLowerCase();
                if (prodFabric) {
                    const hasMatch = selectedValues.some(opt => prodFabric.includes(opt));
                    if (!hasMatch) match = false;
                } else {
                    const dataScope = ((p.description || '') + ' ' + (p.title || '')).toLowerCase();
                    const hasMatch = selectedValues.some(opt => dataScope.includes(opt));
                    if (!hasMatch) match = false;
                }
            } else if (fid === 'fit') {
                const prodFit = (p.features && p.features.fit || '').toLowerCase();
                if (prodFit) {
                    const hasMatch = selectedValues.some(opt => prodFit.includes(opt));
                    if (!hasMatch) match = false;
                } else {
                    const dataScope = ((p.description || '') + ' ' + (p.title || '')).toLowerCase();
                    const hasMatch = selectedValues.some(opt => dataScope.includes(opt));
                    if (!hasMatch) match = false;
                }
            } else if (fid === 'sleeve') {
                const prodSleeve = (p.features && p.features.sleeve || '').toLowerCase();
                if (prodSleeve) {
                    const hasMatch = selectedValues.some(opt => prodSleeve.includes(opt));
                    if (!hasMatch) match = false;
                } else {
                    const dataScope = ((p.description || '') + ' ' + (p.title || '')).toLowerCase();
                    const hasMatch = selectedValues.some(opt => dataScope.includes(opt));
                    if (!hasMatch) match = false;
                }
            } else if (fid === 'neck') {
                const dataScope = ((p.description || '') + ' ' + (p.title || '')).toLowerCase();
                const hasMatch = selectedValues.some(opt => dataScope.includes(opt));
                if (!hasMatch) match = false;
            } else if (fid === 'gsm') {
                if (p.gsm) {
                    if (!selectedValues.includes(p.gsm.toString())) match = false;
                } else {
                    const dataScope = ((p.description || '') + ' ' + (p.title || '')).toLowerCase();
                    const hasMatch = selectedValues.some(gsm => dataScope.includes(gsm));
                    if (!hasMatch) match = false;
                }
            } else {
                const dataScope = ((p.description || '') + ' ' + (p.title || '')).toLowerCase();
                const optionMatch = selectedValues.some(opt => dataScope.includes(opt));
                if (!optionMatch) match = false;
            }
        });

        return match;
    });

    // Intelligent Search Auto-Correction (Fuzzy)
    const suggestionEl = document.getElementById('search-suggestion');
    suggestionEl.classList.add('hide');

    if (filtered.length === 0 && state.searchQuery && !state.selectedCategory && !state.disableFuzzyMatch) {
        // Try to fuzzy match a category
        const categoriesNodes = allCategoriesRaw.map(c => c.name);
        const bestMatch = getFuzzyMatch(state.searchQuery, categoriesNodes);

        // Increase threshold to allow more typos (e.g. "hadiiiiii" -> "Hoodies")
        const threshold = Math.max(3, Math.floor(state.searchQuery.length * 0.6));

        if (bestMatch && bestMatch.distance <= threshold) {
            console.log(`🎯 Fuzzy search: auto-applying category "${bestMatch.target}" for query "${state.searchQuery}"`);

            const originalQuery = state.searchQuery;
            // Set category
            state.selectedCategory = bestMatch.target.toLowerCase();
            document.getElementById('category-select').value = bestMatch.target;

            // Clear current search text so it doesn't conflict with the new category filter
            state.searchQuery = '';
            const globalSearchInput = document.getElementById('global-search-input');
            if (globalSearchInput) globalSearchInput.value = '';

            updateSubcategoryFilters();
            renderDynamicFilters();
            renderCategoryDropdown(); // Sync sidebar and mobile pill visuals

            // Re-apply filter with corrected category
            filtered = allProducts.filter(p => (p.categoryName || '').toLowerCase() === state.selectedCategory);

            // Show suggestion in UI without a container, just italic text with a clickable link
            suggestionEl.innerHTML = `Showing results for <strong>${bestMatch.target}</strong><br>Search instead for <a href="javascript:void(0)" onclick="forceOriginalSearch('${originalQuery.replace(/'/g, "\\'")}')"><strong>${originalQuery}</strong></a>`;
            suggestionEl.classList.remove('hide');
        }
    }

    filteredProducts = filtered;

    // 2. Sort Logic
    switch (state.sort) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.id.localeCompare(a.id));
            break;
        case 'rating':
            filteredProducts.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
            break;
        default:
            break;
    }

    updateURL();
    renderMainArea();
}

function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1  // deletion
                    )
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

function getFuzzyMatch(query, targets) {
    let bestMatch = null;
    let minDistance = Infinity;

    targets.forEach(target => {
        const distance = levenshteinDistance(query.toLowerCase(), target.toLowerCase());
        if (distance < minDistance) {
            minDistance = distance;
            bestMatch = target;
        }
    });

    return { target: bestMatch, distance: minDistance };
}

function updateURL() {
    const url = new URL(window.location);
    url.search = '';

    if (state.selectedCategory) url.searchParams.set('category', state.selectedCategory);

    let cleanSubs = Array.from(new Set(state.selectedSubcategories));
    if (cleanSubs.length > 0) url.searchParams.set('subcategory', cleanSubs.join(','));

    let cleanCols = Array.from(new Set(state.selectedCollections));
    if (cleanCols.length > 0) url.searchParams.set('collection', cleanCols.join(','));

    Object.keys(state.dynamicFilters).forEach(fid => {
        if (state.dynamicFilters[fid]) {
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
    prevBtn.onclick = () => { state.page--; applyFilters(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    container.appendChild(prevBtn);

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
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
        btn.onclick = () => { state.page = i; applyFilters(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
        container.appendChild(btn);
    }

    // Next Button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = '&raquo;';
    nextBtn.disabled = state.page === totalPages;
    nextBtn.onclick = () => { state.page++; applyFilters(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    container.appendChild(nextBtn);
}

// Global search execution override for header search bar
window.executeGlobalSearch = function (queryStr) {
    let q = queryStr;
    if (!q) q = document.getElementById('global-search-input')?.value;
    if (q) {
        state.searchQuery = q.toLowerCase();
        state.disableFuzzyMatch = false; // Reset fuzzy override on new search
        state.page = 1;
        applyFilters();
    }
};

window.forceOriginalSearch = function (originalQuery) {
    state.searchQuery = originalQuery.toLowerCase();
    state.selectedCategory = '';
    document.getElementById('category-select').value = '';
    const globalSearchInput = document.getElementById('global-search-input');
    if (globalSearchInput) globalSearchInput.value = originalQuery;

    state.disableFuzzyMatch = true; // Prevent auto-correction
    state.page = 1;

    updateSubcategoryFilters();
    renderDynamicFilters();
    renderCategoryDropdown();
    applyFilters();
};
