/**
 * Profile Page Logic
 * Handles checking auth session, loading user data, and updating profile info.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check Auth state
    const user = window.authService.getCurrentUser();
    if (!user) {
        // Not logged in, bounds back to homepage
        window.location.href = 'index.html';
        return;
    }

    // 2. Load basic info
    const greeting = document.getElementById('profile-greeting');
    const phoneView = document.getElementById('profile-phone');
    const inputName = document.getElementById('profile-name');
    const inputEmail = document.getElementById('profile-email');
    const inputPhone = document.getElementById('profile-phone-input');
    const inputAddress = document.getElementById('profile-address');
    const inputPincode = document.getElementById('profile-pincode');

    const updateView = (u) => {
        greeting.textContent = u.name ? `Welcome back, ${u.name.split(' ')[0]}!` : 'Welcome back!';
        phoneView.textContent = u.phone ? `+91 ${u.phone.substring(0,2)}******${u.phone.substring(8)}` : '';
        inputName.value = u.name || '';
        inputEmail.value = u.email || '';
        inputPhone.value = u.phone || '';
        inputAddress.value = u.address || '';
        inputPincode.value = u.pincode || '';
    }

    updateView(user);

    // 3. Sidebar Navigation Logic
    const navItems = document.querySelectorAll('.nav-item');
    const contentViews = document.querySelectorAll('.content-view');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetViewId = `view-${item.dataset.view}`;
            
            // Update active sidebar item
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Toggle views
            contentViews.forEach(view => {
                if (view.id === targetViewId) {
                    view.classList.add('active');
                } else {
                    view.classList.remove('active');
                }
            });

            // Smooth scroll to top on mobile
            if (window.innerWidth <= 900) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // 4. Setup Edit Toggle
    const editBtn = document.getElementById('edit-profile-btn');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    const formActions = document.querySelector('.form-actions');
    const profileForm = document.getElementById('profile-form');
    const inputsToEdit = [inputName, inputEmail, inputAddress, inputPincode]; // We won't allow phone edit in this mock

    editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        inputsToEdit.forEach(i => i.disabled = false);
        formActions.style.display = 'flex';
        editBtn.style.display = 'none';
        inputName.focus();
    });

    cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        inputsToEdit.forEach(i => i.disabled = true);
        formActions.style.display = 'none';
        editBtn.style.display = 'block';
        updateView(window.authService.getCurrentUser()); // Reset logic
    });

    // 5. Save form
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const saveBtn = document.getElementById('save-profile-btn');
        const ogText = saveBtn.textContent;
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;

        try {
            const updatedUser = await window.authService.updateProfile({
                name: inputName.value.trim(),
                email: inputEmail.value.trim(),
                address: inputAddress.value.trim(),
                pincode: inputPincode.value.trim()
            });

            updateView(updatedUser);
            inputsToEdit.forEach(i => i.disabled = true);
            formActions.style.display = 'none';
            editBtn.style.display = 'block';
            
            // Dispatch event so Header might update immediately if it showed name
            window.dispatchEvent(new CustomEvent('auth:profile-updated'));

        } catch (error) {
            console.error(error);
            alert('Failed to save profile!');
        } finally {
            saveBtn.textContent = ogText;
            saveBtn.disabled = false;
        }
    });

    // 6. Setup Logout
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        window.authService.logout();
        window.dispatchEvent(new CustomEvent('auth:logout'));
        window.location.href = 'index.html';
    });

    // 7. Render Mini Wishlist
    const renderMiniWishlist = async () => {
        const view = document.getElementById('view-wishlist');
        if (!view) return;

        const savedItems = window.wishlistService?.getAll() || [];
        if (savedItems.length === 0) {
            view.innerHTML = `
                <div class="profile-card placeholder-card">
                    <img src="constants/icons/heart.svg" alt="" class="placeholder-icon">
                    <h3>My Wishlist</h3>
                    <p>Your wishlist is currently empty.</p>
                    <a href="index.html" class="btn-primary" style="text-decoration: none; display: inline-block; margin-top: 16px;">Browse Products</a>
                </div>
            `;
            return;
        }

        view.innerHTML = `<div class="profile-card"><div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;"><h3>Saved Items (${savedItems.length})</h3><a href="wishlist.html" style="color:#ff4d6d; text-decoration:none; font-weight:600; font-size:14px;">View All</a></div><div id="profile-wl-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(240px, 1fr)); gap:12px;"></div></div>`;
        const grid = document.getElementById('profile-wl-grid');
        
        const db = window.dataService?.productsDB || await window.dataService?.init();
        const allProducts = await window.dataService?.getAllProductsFlattened() || [];
        let allSubcategories = [];
        if (db?.categories) {
            db.categories.forEach(cat => {
                if (cat.sections) cat.sections.forEach(sec => allSubcategories.push(...sec.subcategories));
                if (cat.subcategories) allSubcategories.push(...cat.subcategories);
            });
        }

        // Show max 4 recent items
        const recent = savedItems.sort((a,b) => b.savedAt - a.savedAt).slice(0, 4);

        recent.forEach(saved => {
            let itemData = saved.itemType === 'subcategory' ? allSubcategories.find(s => String(s.id) === String(saved.productId)) : allProducts.find(p => String(p.id) === String(saved.productId));
            itemData = itemData || saved;

            const isSub = saved.itemType === 'subcategory';
            const link = isSub ? `searchPage.html?subcategory=${saved.productId}` : `productDetails.html?id=${saved.productId}`;

            grid.innerHTML += `
                <a href="${link}" style="text-decoration:none; color:inherit; display:flex; gap:12px; align-items:center; background:#f9fafb; padding:10px; border-radius:10px; border:1px solid #eaeaea; transition:all 0.2s;">
                    <img src="${itemData.image || 'constants/products/placeholder.jpg'}" style="width:64px; height:64px; object-fit:cover; border-radius:6px; flex-shrink:0;">
                    <div style="flex:1; min-width:0;">
                        <div style="font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; color:#888;">${isSub ? 'Collection' : 'Product'}</div>
                        <div style="font-weight:600; font-size:14px; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:#111;">${itemData.name || itemData.title || 'Unknown'}</div>
                    </div>
                </a>
            `;
        });
    };

    renderMiniWishlist();
    window.addEventListener('wishlist:updated', renderMiniWishlist);
});
